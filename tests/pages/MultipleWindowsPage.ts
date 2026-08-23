import { Button, Label } from '#framework/ui/elements/index.js';
import BasePage from '#framework/ui/page/BasePage.js';
import { Page } from '@playwright/test';

export default class MultipleWindowsPage extends BasePage {
  private newWindowButton: Button;
  private page: Page;

  constructor(page: Page) {
    super(
      new Label(page.getByRole('heading', { name: 'Opening a new window' }), 'Multiple Windows page unique locator'),
      'Multiple Windows Page'
    );
    this.newWindowButton = new Button(page.locator('//a[@target="_blank"]', { hasText: 'Click Here' }), 'New Window button');
    this.page = page;
  }

  async getPopupWindowText(): Promise<string> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.newWindowButton.click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    const popupText = await popup.title();
    await popup.close();
    return popupText;
  }
}
