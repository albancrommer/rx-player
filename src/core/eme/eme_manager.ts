/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  concat as observableConcat,
  defer as observableDefer,
  EMPTY,
  merge as observableMerge,
  Observable,
  of as observableOf,
  ReplaySubject,
} from "rxjs";
import {
  catchError,
  filter,
  ignoreElements,
  map,
  mapTo,
  mergeMap,
  multicast,
  refCount,
  share,
  tap,
} from "rxjs/operators";
import {
  events,
  generateKeyRequest,
  shouldUnsetMediaKeys,
} from "../../compat/";
import { EncryptedMediaError } from "../../errors";
import log from "../../log";
import { assertInterface } from "../../utils/assert";
import noop from "../../utils/noop";
import attachMediaKeys from "./attach_media_keys";
import disposeMediaKeys from "./dispose_media_keys";
import getMediaKeysInfos from "./get_media_keys";
import getSession from "./get_session";
import handleSessionEvents from "./handle_session_events";
import MediaKeysInfosStore from "./media_keys_infos_store";
import setServerCertificate from "./set_server_certificate";
import {
  IEMEInitEvent,
  IEMEWarningEvent,
  IKeySystemOption,
  IMediaKeysInfos,
} from "./types";
import InitDataStore from "./utils/init_data_store";

const { onEncrypted$ } = events;

const attachedMediaKeysInfos = new MediaKeysInfosStore();

/**
 * Clear EME ressources that should be cleared when the current content stops
 * its playback.
 * @returns {Observable}
 */
function clearEMESession(mediaElement : HTMLMediaElement) : Observable<never> {
  return observableDefer(() => {
    if (shouldUnsetMediaKeys()) {
      return disposeMediaKeys(mediaElement, attachedMediaKeysInfos)
        .pipe(ignoreElements());
    }

    const currentState = attachedMediaKeysInfos.getState(mediaElement);
    if (currentState && currentState.keySystemOptions.closeSessionsOnStop) {
      return currentState.sessionsStore.closeAllSessions()
        .pipe(ignoreElements());
    }
    return EMPTY;
  });
}

// TODO More events
export type IEMEManagerEvent =
  IEMEWarningEvent |
  IEMEInitEvent;

/**
 * Get media keys infos from key system configs then attach media keys to media element.
 * @param {HTMLMediaElement} mediaElement
 * @param {Array.<Object>} keySystemsConfigs
 * @param {Object} currentMediaKeysInfos
 * @returns {Observable}
 */
function initMediaKeys(
  mediaElement : HTMLMediaElement,
  keySystemsConfigs: IKeySystemOption[],
  currentMediaKeysInfos : MediaKeysInfosStore
): Observable<IMediaKeysInfos> {
  return getMediaKeysInfos(
    mediaElement, keySystemsConfigs, currentMediaKeysInfos
  ).pipe(
    mergeMap((mediaKeysInfos) =>
      attachMediaKeys(mediaKeysInfos, mediaElement, currentMediaKeysInfos)
        .pipe(mapTo(mediaKeysInfos))
    )
  );
}

/**
 * EME abstraction and event handler used to communicate with the Content-
 * Description-Module (CDM).
 *
 * The EME handler can be given one or multiple systems and will choose the
 * appropriate one supported by the user's browser.
 * @param {HTMLMediaElement} mediaElement
 * @param {Array.<Object>} keySystems
 * @returns {Observable}
 */
export default function EMEManager(
  mediaElement : HTMLMediaElement,
  keySystemsConfigs: IKeySystemOption[]
) : Observable<IEMEManagerEvent> {
  if (__DEV__) {
    keySystemsConfigs.forEach((config) => assertInterface(config, {
      getLicense: "function",
      type: "string",
    }, "keySystem"));
  }

   // Keep track of all initialization data handled here.
   // This is to avoid handling multiple times the same encrypted events.
  const handledInitData = new InitDataStore();

  const initMediaKeys$ = initMediaKeys(
    mediaElement, keySystemsConfigs, attachedMediaKeysInfos);

  const listenEncryptedEvents$ = onEncrypted$(mediaElement).pipe(
    // equivalent to a sane shareReplay:
    // https://github.com/ReactiveX/rxjs/issues/3336
    // XXX TODO Replace it when that issue is resolved
    multicast(() => new ReplaySubject(1)),
    refCount()
  );

  return initMediaKeys$.pipe(
    mergeMap((mediaKeysInfos) => {
      return observableMerge(
        observableOf({ type: "eme-init" as "eme-init", value: mediaKeysInfos }),
        /* Catch "encrypted" event and create MediaKeys */
        listenEncryptedEvents$.pipe(
          /* Attach server certificate and create/reuse MediaKeySession */
          mergeMap((encryptedEvent, i) => {
            log.debug("EME: encrypted event received", encryptedEvent);

            const { keySystemOptions, mediaKeys } = mediaKeysInfos;
            const { serverCertificate } = keySystemOptions;

            const session$ = getSession(encryptedEvent, handledInitData, mediaKeysInfos)
              .pipe(map((evt) => ({
                type: evt.type,
                value: {
                  initData: evt.value.initData,
                  initDataType: evt.value.initDataType,
                  mediaKeySession: evt.value.mediaKeySession,
                  sessionType: evt.value.sessionType,
                  keySystemOptions: mediaKeysInfos.keySystemOptions,
                  sessionStorage: mediaKeysInfos.sessionStorage,
                },
              })));

            if (i === 0) { // first encrypted event for the current content
              return observableMerge(
                serverCertificate != null ?

                  observableConcat(
                    setServerCertificate(mediaKeys, serverCertificate),
                    session$
                  ) : session$
              );
            }

            return session$;
          }),

          /* Trigger license request and manage MediaKeySession events */
          mergeMap((sessionInfosEvt) =>  {
            if (sessionInfosEvt.type === "warning") {
              return observableOf(sessionInfosEvt);
            }

            const {
              initData,
              initDataType,
              mediaKeySession,
              sessionType,
              keySystemOptions,
              sessionStorage,
            } = sessionInfosEvt.value;

            return observableMerge(
              handleSessionEvents(mediaKeySession, keySystemOptions),

              // only perform generate request on new sessions
              sessionInfosEvt.type === "created-session" ?
                generateKeyRequest(mediaKeySession, initData, initDataType).pipe(
                  tap(() => {
                    if (sessionType === "persistent-license" && sessionStorage != null) {
                      sessionStorage.add(initData, initDataType, mediaKeySession);
                    }
                  }),
                  catchError((error) => {
                    throw new EncryptedMediaError(
                      "KEY_GENERATE_REQUEST_ERROR", error, false);
                  }),
                  ignoreElements()
                ) : EMPTY
            ).pipe(filter((sessionEvent) : sessionEvent is IEMEWarningEvent =>
              sessionEvent.type === "warning"
            ));
          }))
      );
    }),
    share()
  );
}

/**
 * Free up all ressources taken by the EME management.
 */
function disposeEME(mediaElement : HTMLMediaElement) : void {
  disposeMediaKeys(mediaElement, attachedMediaKeysInfos).subscribe(noop);
}

/**
 * Returns the name of the current key system used.
 * @returns {string}
 */
function getCurrentKeySystem(mediaElement : HTMLMediaElement) : string|null {
  const currentState = attachedMediaKeysInfos.getState(mediaElement);
  return currentState && currentState.keySystemOptions.type;
}

export {
  clearEMESession,
  disposeEME,
  getCurrentKeySystem,
};
