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

describe("compat - isFullScreen", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should return false when is not fullscreen", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origmozFullScreenElement = (document as any).mozFullScreenElement;
    const origWebkitFullscreenElement = (document as any).webkitFullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;

    (document as any).fullscreenElement = false;
    (document as any).mozFullScreenElement = undefined;
    (document as any).webkitFullscreenElement = undefined;
    (document as any).msFullscreenElement = undefined;

    const { isFullscreen } = require("../fullscreen");
    expect(isFullscreen()).toBe(false);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).mozFullScreenElement = origmozFullScreenElement;
    (document as any).webkitFullscreenElement = origWebkitFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
  });

  it("should return true when is fullscreen", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origmozFullScreenElement = (document as any).mozFullScreenElement;
    const origWebkitFullscreenElement = (document as any).webkitFullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;

    (document as any).fullscreenElement = true;
    (document as any).mozFullScreenElement = undefined;
    (document as any).webkitFullscreenElement = undefined;
    (document as any).msFullscreenElement = undefined;

    const { isFullscreen } = require("../fullscreen");
    expect(isFullscreen()).toBe(true);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).mozFullScreenElement = origmozFullScreenElement;
    (document as any).webkitFullscreenElement = origWebkitFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
  });
});

describe("compat - requestFullscreen", () => {
  it("should request full screen with requestFullscreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    (document as any).fullscreenElement = false;

    const { requestFullscreen } = require("../fullscreen");
    const mockRequestFullscreen =
      jest.fn(() => (document as any).fullscreenElement = true);
    const fakeElement = {
      requestFullscreen: mockRequestFullscreen,
    };

    requestFullscreen(fakeElement);
    expect((document as any).fullscreenElement).toBe(true);

    (document as any).fullscreenElement = origFullscreenElement;
  });

  it("should request full screen with msRequestFullscreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;

    (document as any).fullscreenElement = undefined;
    (document as any).msFullscreenElement = false;

    const { requestFullscreen } = require("../fullscreen");
    const mockRequestFullscreen =
      jest.fn(() => (document as any).msFullscreenElement = true);
    const fakeElement = {
      msRequestFullscreen: mockRequestFullscreen,
    };

    requestFullscreen(fakeElement);
    expect((document as any).msFullscreenElement).toBe(true);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
  });

  it("should request full screen with mozRequestFullScreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;
    const origmozFullScreenElement = (document as any).mozFullScreenElement;

    (document as any).fullscreenElement = undefined;
    (document as any).msFullscreenElement = undefined;
    (document as any).mozFullScreenElement = false;

    const { requestFullscreen } = require("../fullscreen");
    const mockRequestFullscreen =
      jest.fn(() => (document as any).mozFullScreenElement = true);
    const fakeElement = {
      mozRequestFullScreen: mockRequestFullscreen,
    };

    requestFullscreen(fakeElement);
    expect((document as any).mozFullScreenElement).toBe(true);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
    (document as any).mozFullScreenElement = origmozFullScreenElement;
  });

  it("should request full screen with webkitRequestFullscreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;
    const origmozFullScreenElement = (document as any).mozFullScreenElement;
    const origWebkitFullscreenElement = (document as any).webkitFullscreenElement;

    (document as any).fullscreenElement = undefined;
    (document as any).msFullscreenElement = undefined;
    (document as any).mozFullScreenElement = undefined;
    (document as any).webkitFullscreenElement = false;

    const { requestFullscreen } = require("../fullscreen");
    const mockRequestFullscreen =
      jest.fn(() => (document as any).webkitFullscreenElement = true);
    const fakeElement = {
      webkitRequestFullscreen: mockRequestFullscreen,
    };

    requestFullscreen(fakeElement);
    expect((document as any).webkitFullscreenElement).toBe(true);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
    (document as any).mozFullScreenElement = origmozFullScreenElement;
    (document as any).webkitFullscreenElement = origWebkitFullscreenElement;
  });
});

describe("compat - exitFullScreen", () => {
  it("should exit full screen with exitFullscreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origExitFullscreen = (document as any).exitFullscreen;

    (document as any).fullscreenElement = true;
    (document as any).exitFullscreen = jest.fn(() => {
      (document as any).fullscreenElement = false;
    });

    const { exitFullscreen } = require("../fullscreen");

    exitFullscreen();
    expect((document as any).fullscreenElement).toBe(false);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).exitFullscreen = origExitFullscreen;
  });

  it("should exit full screen with msExitFullscreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;
    const origExitFullscreen = (document as any).exitFullscreen;
    const origMsExitFullscreen = (document as any).msExitFullscreen;

    (document as any).fullscreenElement = undefined;
    (document as any).msFullscreenElement = true;
    (document as any).exitFullscreen = undefined;
    (document as any).msExitFullscreen = jest.fn(() => {
      (document as any).msFullscreenElement = false;
    });

    const { exitFullscreen } = require("../fullscreen");

    exitFullscreen();
    expect((document as any).msFullscreenElement).toBe(false);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
    (document as any).exitFullscreen = origExitFullscreen;
    (document as any).msExitFullscreen = origMsExitFullscreen;
  });

  it("should exit full screen with mozCancelFullScreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;
    const origmozFullScreenElement = (document as any).mozFullScreenElement;
    const origExitFullscreen = (document as any).exitFullscreen;
    const origMsExitFullscreen = (document as any).msExitFullscreen;
    const origmozCancelFullScreen = (document as any).mozCancelFullScreen;

    (document as any).fullscreenElement = undefined;
    (document as any).msFullscreenElement = undefined;
    (document as any).mozFullScreenElement = true;
    (document as any).exitFullscreen = undefined;
    (document as any).msExitFullscreen = undefined;
    (document as any).mozCancelFullScreen = jest.fn(() =>
      (document as any).mozFullScreenElement = false);

    const { exitFullscreen } = require("../fullscreen");

    exitFullscreen();
    expect((document as any).mozFullScreenElement).toBe(false);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
    (document as any).mozFullScreenElement = origmozFullScreenElement;
    (document as any).exitFullscreen = origExitFullscreen;
    (document as any).msExitFullscreen = origMsExitFullscreen;
    (document as any).mozCancelFullScreen = origmozCancelFullScreen;
  });

  it("should exit full screen with webkitExitFullscreen API", () => {
    const origFullscreenElement = (document as any).fullscreenElement;
    const origMsFullscreenElement = (document as any).msFullscreenElement;
    const origmozFullScreenElement = (document as any).mozFullScreenElement;
    const origWebkitFullscreenElement = (document as any).webkitFullscreenElement;
    const origExitFullscreen = (document as any).exitFullscreen;
    const origMsExitFullscreen = (document as any).msExitFullscreen;
    const origmozCancelFullScreen = (document as any).mozCancelFullScreen;
    const origwebkitExitFullscreen = (document as any).webkitExitFullscreen;

    (document as any).fullscreenElement = undefined;
    (document as any).msFullscreenElement = undefined;
    (document as any).mozFullScreenElement = undefined;
    (document as any).webkitFullscreenElement = true;
    (document as any).exitFullscreen = undefined;
    (document as any).msExitFullscreen = undefined;
    (document as any).mozCancelFullScreen = undefined;
    (document as any).webkitExitFullscreen = jest.fn(() =>
    (document as any).webkitFullscreenElement = false);

    const { exitFullscreen } = require("../fullscreen");

    exitFullscreen();
    expect((document as any).webkitFullscreenElement).toBe(false);

    (document as any).fullscreenElement = origFullscreenElement;
    (document as any).msFullscreenElement = origMsFullscreenElement;
    (document as any).mozFullScreenElement = origmozFullScreenElement;
    (document as any).webkitFullscreenElement = origWebkitFullscreenElement;
    (document as any).exitFullscreen = origExitFullscreen;
    (document as any).msExitFullscreen = origMsExitFullscreen;
    (document as any).mozCancelFullScreen = origmozCancelFullScreen;
    (document as any).webkitExitFullscreen = origwebkitExitFullscreen;
  });
});
