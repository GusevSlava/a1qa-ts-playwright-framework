import BasePage from '#framework/ui/page/BasePage.js';
import { Label } from '#framework/ui/elements/index.js';
import { Page } from '@playwright/test';

export default class MainPage extends BasePage {
  private page: Page;

  constructor(page: Page) {
    super(
      new Label(page.getByRole('heading', { name: /Welcome to the-internet/i, level: 1 }), 'Main Page Header'),
      'Main Page'
    );
    this.page = page;
  }

  private navigationLink(text: string): Label {
    return new Label(this.page.getByRole('link', { name: text }), `Navigation link: ${text}`);
  }

  async clickNavigationLink(navigationText: string): Promise<void> {
    await this.navigationLink(navigationText).click();
  }
}
