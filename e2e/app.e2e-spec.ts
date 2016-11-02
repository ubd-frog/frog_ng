import { FrogAppPage } from './app.po';

describe('frog-app App', function() {
  let page: FrogAppPage;

  beforeEach(() => {
    page = new FrogAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
