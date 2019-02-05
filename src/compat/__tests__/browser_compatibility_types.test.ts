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

describe("compat - browser compatibility types", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should use the native MediaSource if defined", () => {
    const origMediaSource = (window as any).MediaSource;
    const origMozMediaSource = (window as any).MozMediaSource;
    const origWebKitMediaSource = (window as any).WebKitMediaSource;
    const origMSMediaSource = (window as any).MSMediaSource;

    (window as any).MediaSource = { a: 1 };
    (window as any).MozMediaSource = { a: 2 };
    (window as any).WebKitMediaSource = { a: 3 };
    (window as any).MSMediaSource = { a: 4 };

    const { MediaSource_ } = require("../browser_compatibility_types");
    expect(MediaSource_).toEqual({ a: 1 });

    (window as any).MediaSource = origMediaSource;
    (window as any).MozMediaSource = origMozMediaSource;
    (window as any).WebKitMediaSource = origWebKitMediaSource;
    (window as any).MSMediaSource = origMSMediaSource;
  });

  it("should use MozMediaSource if defined and MediaSource is not", () => {
    const origMediaSource = (window as any).MediaSource;
    const origMozMediaSource = (window as any).MozMediaSource;
    const origWebKitMediaSource = (window as any).WebKitMediaSource;
    const origMSMediaSource = (window as any).MSMediaSource;

    (window as any).MediaSource = undefined;
    (window as any).MozMediaSource = { a: 2 };
    (window as any).WebKitMediaSource = undefined;
    (window as any).MSMediaSource = undefined;

    const { MediaSource_ } = require("../browser_compatibility_types");
    expect(MediaSource_).toEqual({ a: 2 });

    (window as any).MediaSource = origMediaSource;
    (window as any).MozMediaSource = origMozMediaSource;
    (window as any).WebKitMediaSource = origWebKitMediaSource;
    (window as any).MSMediaSource = origMSMediaSource;
  });

  it("should use WebKitMediaSource if defined and MediaSource is not", () => {
    const origMediaSource = (window as any).MediaSource;
    const origMozMediaSource = (window as any).MozMediaSource;
    const origWebKitMediaSource = (window as any).WebKitMediaSource;
    const origMSMediaSource = (window as any).MSMediaSource;

    (window as any).MediaSource = undefined;
    (window as any).MozMediaSource = undefined;
    (window as any).WebKitMediaSource = { a: 3 };
    (window as any).MSMediaSource = undefined;

    const { MediaSource_ } = require("../browser_compatibility_types");
    expect(MediaSource_).toEqual({ a: 3 });

    (window as any).MediaSource = origMediaSource;
    (window as any).MozMediaSource = origMozMediaSource;
    (window as any).WebKitMediaSource = origWebKitMediaSource;
    (window as any).MSMediaSource = origMSMediaSource;
  });

  it("should use MSMediaSource if defined and MediaSource is not", () => {
    const origMediaSource = (window as any).MediaSource;
    const origMozMediaSource = (window as any).MozMediaSource;
    const origWebKitMediaSource = (window as any).WebKitMediaSource;
    const origMSMediaSource = (window as any).MSMediaSource;

    (window as any).MediaSource = undefined;
    (window as any).MozMediaSource = undefined;
    (window as any).WebKitMediaSource = undefined;
    (window as any).MSMediaSource = { a: 4 };

    const { MediaSource_ } = require("../browser_compatibility_types");
    expect(MediaSource_).toEqual({ a: 4 });

    (window as any).MediaSource = origMediaSource;
    (window as any).MozMediaSource = origMozMediaSource;
    (window as any).WebKitMediaSource = origWebKitMediaSource;
    (window as any).MSMediaSource = origMSMediaSource;
  });

  it("should use the native MediaKeys if defined", () => {
    const origMediaKeys = (window as any).MediaKeys;
    const origMozMediaKeys = (window as any).MozMediaKeys;
    const origWebKitMediaKeys = (window as any).WebKitMediaKeys;
    const origMSMediaKeys = (window as any).MSMediaKeys;

    (window as any).MediaKeys = { a: 1 };
    (window as any).MozMediaKeys = { a: 2 };
    (window as any).WebKitMediaKeys = { a: 3 };
    (window as any).MSMediaKeys = { a: 4 };

    const { MediaKeys_ } = require("../browser_compatibility_types");
    expect(MediaKeys_).toEqual({ a: 1 });

    (window as any).MediaKeys = origMediaKeys;
    (window as any).MozMediaKeys = origMozMediaKeys;
    (window as any).WebKitMediaKeys = origWebKitMediaKeys;
    (window as any).MSMediaKeys = origMSMediaKeys;
  });

  it("should use MozMediaKeys if defined and MediaKeys is not", () => {
    const origMediaKeys = (window as any).MediaKeys;
    const origMozMediaKeys = (window as any).MozMediaKeys;
    const origWebKitMediaKeys = (window as any).WebKitMediaKeys;
    const origMSMediaKeys = (window as any).MSMediaKeys;

    (window as any).MediaKeys = undefined;
    (window as any).MozMediaKeys = { a: 2 };
    (window as any).WebKitMediaKeys = undefined;
    (window as any).MSMediaKeys = undefined;

    const { MediaKeys_ } = require("../browser_compatibility_types");
    expect(MediaKeys_).toEqual({ a: 2 });

    (window as any).MediaKeys = origMediaKeys;
    (window as any).MozMediaKeys = origMozMediaKeys;
    (window as any).WebKitMediaKeys = origWebKitMediaKeys;
    (window as any).MSMediaKeys = origMSMediaKeys;
  });

  it("should use WebKitMediaKeys if defined and MediaKeys is not", () => {
    const origMediaKeys = (window as any).MediaKeys;
    const origMozMediaKeys = (window as any).MozMediaKeys;
    const origWebKitMediaKeys = (window as any).WebKitMediaKeys;
    const origMSMediaKeys = (window as any).MSMediaKeys;

    (window as any).MediaKeys = undefined;
    (window as any).MozMediaKeys = undefined;
    (window as any).WebKitMediaKeys = { a: 3 };
    (window as any).MSMediaKeys = undefined;

    const { MediaKeys_ } = require("../browser_compatibility_types");
    expect(MediaKeys_).toEqual({ a: 3 });

    (window as any).MediaKeys = origMediaKeys;
    (window as any).MozMediaKeys = origMozMediaKeys;
    (window as any).WebKitMediaKeys = origWebKitMediaKeys;
    (window as any).MSMediaKeys = origMSMediaKeys;
  });

  it("should use MSMediaKeys if defined and MediaKeys is not", () => {
    const origMediaKeys = (window as any).MediaKeys;
    const origMozMediaKeys = (window as any).MozMediaKeys;
    const origWebKitMediaKeys = (window as any).WebKitMediaKeys;
    const origMSMediaKeys = (window as any).MSMediaKeys;

    (window as any).MediaKeys = undefined;
    (window as any).MozMediaKeys = undefined;
    (window as any).WebKitMediaKeys = undefined;
    (window as any).MSMediaKeys = { a: 4 };

    const { MediaKeys_ } = require("../browser_compatibility_types");
    expect(MediaKeys_).toEqual({ a: 4 });

    (window as any).MediaKeys = origMediaKeys;
    (window as any).MozMediaKeys = origMozMediaKeys;
    (window as any).WebKitMediaKeys = origWebKitMediaKeys;
    (window as any).MSMediaKeys = origMSMediaKeys;
  });

  it("should throw when using compat MediaKeys methods if no MediaKeys API", () => {
    const origMediaKeys = (window as any).MediaKeys;
    const origMozMediaKeys = (window as any).MozMediaKeys;
    const origWebKitMediaKeys = (window as any).WebKitMediaKeys;
    const origMSMediaKeys = (window as any).MSMediaKeys;

    (window as any).MediaKeys = undefined;
    (window as any).MozMediaKeys = undefined;
    (window as any).WebKitMediaKeys = undefined;
    (window as any).MSMediaKeys = undefined;

    const { MediaKeys_ } = require("../browser_compatibility_types");

    const mediaKeys = new MediaKeys_();

    expect(() => mediaKeys.create()).toThrow();
    expect(() => mediaKeys.createSession()).toThrow();
    expect(() => mediaKeys.isTypeSupported()).toThrow();
    expect(() => mediaKeys.setServerCertificate()).toThrow();

    (window as any).MediaKeys = origMediaKeys;
    (window as any).MozMediaKeys = origMozMediaKeys;
    (window as any).WebKitMediaKeys = origWebKitMediaKeys;
    (window as any).MSMediaKeys = origMSMediaKeys;
  });
});
