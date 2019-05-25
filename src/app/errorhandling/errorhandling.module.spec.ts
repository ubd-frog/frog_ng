import { ErrorhandlingModule } from './errorhandling.module';

describe('ErrorhandlingModule', () => {
  let errorhandlingModule: ErrorhandlingModule;

  beforeEach(() => {
    errorhandlingModule = new ErrorhandlingModule();
  });

  it('should create an instance', () => {
    expect(errorhandlingModule).toBeTruthy();
  });
});
