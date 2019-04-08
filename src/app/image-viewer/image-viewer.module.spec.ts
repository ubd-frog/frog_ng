import { ImageViewerModule } from './image-viewer.module';

describe('ImageViewerModule', () => {
  let imageViewerModule: ImageViewerModule;

  beforeEach(() => {
    imageViewerModule = new ImageViewerModule();
  });

  it('should create an instance', () => {
    expect(imageViewerModule).toBeTruthy();
  });
});
