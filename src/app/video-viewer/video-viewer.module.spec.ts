import { VideoViewerModule } from './video-viewer.module';

describe('VideoViewerModule', () => {
  let videoViewerModule: VideoViewerModule;

  beforeEach(() => {
    videoViewerModule = new VideoViewerModule();
  });

  it('should create an instance', () => {
    expect(videoViewerModule).toBeTruthy();
  });
});
