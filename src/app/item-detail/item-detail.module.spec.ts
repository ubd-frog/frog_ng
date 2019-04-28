import { ItemDetailModule } from './item-detail.module';

describe('ItemDetailModule', () => {
  let itemDetailModule: ItemDetailModule;

  beforeEach(() => {
    itemDetailModule = new ItemDetailModule();
  });

  it('should create an instance', () => {
    expect(itemDetailModule).toBeTruthy();
  });
});
