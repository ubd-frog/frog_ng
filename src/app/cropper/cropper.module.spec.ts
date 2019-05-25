import { CropperModule } from './cropper.module';

describe('CropperModule', () => {
  let cropperModule: CropperModule;

  beforeEach(() => {
    cropperModule = new CropperModule();
  });

  it('should create an instance', () => {
    expect(cropperModule).toBeTruthy();
  });
});
