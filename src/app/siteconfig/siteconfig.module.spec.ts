import { SiteconfigModule } from './siteconfig.module';

describe('SiteconfigModule', () => {
  let siteconfigModule: SiteconfigModule;

  beforeEach(() => {
    siteconfigModule = new SiteconfigModule();
  });

  it('should create an instance', () => {
    expect(siteconfigModule).toBeTruthy();
  });
});
