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
  Observable,
  of as observableOf,
} from "rxjs";
import {
  map,
  mergeMap,
} from "rxjs/operators";
import { ICustomMediaKeys } from "../../compat/";
import {
  EncryptedMediaError,
} from "../../errors";
import log from "../../log";
import castToObservable from "../../utils/castToObservable";
import getMediaKeySystemAccess from "./find_key_system";
import MediaKeysInfosStore from "./media_keys_infos_store";
import setServerCertificate from "./set_server_certificate";
import {
  IKeySystemOption,
  IMediaKeysInfos,
} from "./types";
import SessionsStore from "./utils/open_sessions_store";
import PersistedSessionsStore from "./utils/persisted_session_store";

/**
 * @param {Object} keySystemOptions
 * @returns {Object|null}
 * @throws {EncryptedMediaError}
 */
function createSessionStorage(
  keySystemOptions : IKeySystemOption
) : PersistedSessionsStore|null {
  if (!keySystemOptions.persistentLicense) {
    return null;
  }

  const { licenseStorage } = keySystemOptions;
  if (!licenseStorage) {
    const error = new Error("no license storage found for persistent license.");
    throw new EncryptedMediaError("INVALID_KEY_SYSTEM", error, true);
  }

  log.info("set the given license storage");
  return new PersistedSessionsStore(licenseStorage);
}

export default function getMediaKeysInfos(
  mediaElement : HTMLMediaElement,
  keySystemsConfigs: IKeySystemOption[],
  currentMediaKeysInfos : MediaKeysInfosStore
) : Observable<IMediaKeysInfos> {
    return getMediaKeySystemAccess(
      mediaElement,
      keySystemsConfigs,
      currentMediaKeysInfos
    ).pipe(mergeMap((evt) => {
      const {
        options,
        mediaKeySystemAccess,
      } = evt.value;
      const currentState = currentMediaKeysInfos.getState(mediaElement);

      let mediaKeys$ : Observable<{
        mediaKeys : ICustomMediaKeys|MediaKeys;
        sessionsStore : SessionsStore;
      }>;
      if (currentState != null && evt.type === "reuse-media-key-system-access") {
        const { mediaKeys, sessionsStore } = currentState;
        mediaKeys$ = observableOf({ mediaKeys, sessionsStore });
      } else {
        mediaKeys$ = castToObservable(mediaKeySystemAccess.createMediaKeys())
          .pipe(map((mediaKeys) => ({
            mediaKeys,
            sessionsStore: new SessionsStore(mediaKeys),
          })));
      }

      return mediaKeys$
        .pipe(mergeMap(({ mediaKeys, sessionsStore }) => {
          const { serverCertificate } = options;
          return (
            serverCertificate != null ?
              setServerCertificate(mediaKeys, serverCertificate) :
              observableOf(null)
          ).pipe(
            map((error) => {
                return {
                  mediaKeySystemAccess,
                  keySystemOptions: options,
                  mediaKeys,
                  sessionsStore,
                  sessionStorage: createSessionStorage(options),
                  serverCertificateWarning: error,
                };
            })
          );
        }));
    }));
}
