type WebKitDocument = Document & { webkitFullscreenElement?: Element | null };

/**
 * Works around Safari taking every click while a video is paused in full screen.
 *
 * 250ms after the largest video in a full-screen element pauses, WebKit looks for text in its frame (Live Text), and
 * on macOS lays a VisionKit view over the whole page that takes every mouse press, so the controls stop responding
 * until the video plays again. WebKit skips a video whose box is empty, so while a played video is paused in full
 * screen, a canvas shows its frame instead and the video shrinks to nothing. (Not `display: none`: Safari forgets the
 * position of a video that is displayed again.)
 *
 * Only in WebKit, which `webkitSetPresentationMode` tells apart: elsewhere the video stays, with its captions. Returns
 * what undoes it.
 *
 * @internal
 */
export function nbHoldPausedFrame(video: HTMLVideoElement, container: HTMLElement, still: HTMLCanvasElement) {
  if (!('webkitSetPresentationMode' in video)) {
    return () => {};
  }
  const document = container.ownerDocument as WebKitDocument;
  const fullscreen = () => (document.fullscreenElement ?? document.webkitFullscreenElement) === container;

  const release = () => {
    still.classList.remove('shown');
    video.style.removeProperty('width');
    video.style.removeProperty('height');
  };
  const hold = () => {
    // A video that hasn't played shows its poster, and WebKit leaves it alone.
    if (!video.played.length || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth) {
      return;
    }
    try {
      still.width = video.videoWidth;
      still.height = video.videoHeight;
      still.getContext('2d')?.drawImage(video, 0, 0);
    } catch {
      return;
    }
    still.classList.add('shown');
    video.style.width = '0';
    video.style.height = '0';
  };
  const update = () => (video.paused && !video.seeking && fullscreen() ? hold() : release());

  const controller = new AbortController();
  const options = { signal: controller.signal };
  for (const type of ['pause', 'seeked', 'ended']) {
    video.addEventListener(type, update, options);
  }
  // While it plays or seeks, the video shows its frames itself.
  video.addEventListener('play', release, options);
  video.addEventListener('seeking', release, options);
  document.addEventListener('fullscreenchange', update, options);
  document.addEventListener('webkitfullscreenchange', update, options);
  update();

  return () => {
    controller.abort();
    release();
  };
}
