import { WorksModule } from './works.module';

describe('WorksModule', () => {
  let worksModule: WorksModule;

  beforeEach(() => {
    worksModule = new WorksModule();
  });

  it('should create an instance', () => {
    expect(worksModule).toBeTruthy();
  });
});
