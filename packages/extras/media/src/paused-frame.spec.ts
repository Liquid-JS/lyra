import { nbHoldPausedFrame } from './paused-frame';

describe('nbHoldPausedFrame', () => {
  let container: HTMLDivElement;
  let video: HTMLVideoElement;
  let still: HTMLCanvasElement;
  let state: { paused: boolean; played: number; fullscreen: boolean };

  // A video in Safari's full screen, as far as the workaround looks at it.
  function webkitVideo() {
    const element = document.createElement('video');
    Object.defineProperties(element, {
      webkitSetPresentationMode: { value: () => {} },
      paused: { get: () => state.paused },
      seeking: { get: () => false },
      played: { get: () => ({ length: state.played }) },
      readyState: { get: () => HTMLMediaElement.HAVE_ENOUGH_DATA },
      videoWidth: { get: () => 16 },
      videoHeight: { get: () => 9 },
    });
    return element;
  }

  beforeEach(() => {
    state = { paused: false, played: 1, fullscreen: true };
    container = document.createElement('div');
    still = document.createElement('canvas');
    document.body.append(container);
    vi.spyOn(document, 'fullscreenElement', 'get').mockImplementation(() => (state.fullscreen ? container : null));
    // Drawing a stand-in video isn't what's tested.
    vi.spyOn(CanvasRenderingContext2D.prototype, 'drawImage').mockImplementation(() => {});
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('shows the paused frame instead of the video, in full screen in WebKit', () => {
    video = webkitVideo();
    container.append(video, still);
    const undo = nbHoldPausedFrame(video, container, still);

    state.paused = true;
    video.dispatchEvent(new Event('pause'));
    expect(still.classList).toContain('shown');
    expect([still.width, still.height]).toEqual([16, 9]);
    expect(video.getBoundingClientRect().width).toBe(0);
    expect(video.style.display).toBe('');

    state.paused = false;
    video.dispatchEvent(new Event('play'));
    expect(still.classList).not.toContain('shown');
    expect(video.style.width).toBe('');

    state.paused = true;
    video.dispatchEvent(new Event('pause'));
    undo();
    expect(still.classList).not.toContain('shown');
    expect(video.style.width).toBe('');
  });

  it('hands back to the video when it leaves full screen, and takes over when it enters paused', () => {
    video = webkitVideo();
    container.append(video, still);
    state.paused = true;
    nbHoldPausedFrame(video, container, still);
    expect(still.classList).toContain('shown');

    state.fullscreen = false;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(still.classList).not.toContain('shown');

    state.fullscreen = true;
    document.dispatchEvent(new Event('fullscreenchange'));
    expect(still.classList).toContain('shown');
  });

  it('leaves a video that hasn\'t played, which shows its poster', () => {
    video = webkitVideo();
    container.append(video, still);
    state.paused = true;
    state.played = 0;
    nbHoldPausedFrame(video, container, still);
    video.dispatchEvent(new Event('pause'));
    expect(still.classList).not.toContain('shown');
  });

  it('does nothing outside WebKit', () => {
    video = document.createElement('video');
    container.append(video, still);
    nbHoldPausedFrame(video, container, still);
    video.dispatchEvent(new Event('pause'));
    expect(still.classList).not.toContain('shown');
  });
});
