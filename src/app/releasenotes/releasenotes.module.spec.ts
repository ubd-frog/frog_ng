import { ReleasenotesModule } from './releasenotes.module';

describe('ReleasenotesModule', () => {
  let releasenotesModule: ReleasenotesModule;

  beforeEach(() => {
    releasenotesModule = new ReleasenotesModule();
  });

  it('should create an instance', () => {
    expect(releasenotesModule).toBeTruthy();
  });
});
