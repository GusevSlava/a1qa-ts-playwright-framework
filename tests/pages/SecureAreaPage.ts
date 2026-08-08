import { Button, Label } from '#framework/ui/elements/index.js';
import BasePage from '#framework/ui/page/BasePage.js';
import { Page } from '@playwright/test';

export default class SecureAreaPage extends BasePage {
  private message: Label;
  private logoutButton: Button;

  constructor(page: Page) {
    super(
      new Label(page.getByRole('heading', { name: 'Secure Area', level: 2 }), 'secure area page unique element'),
      'Secure Area Page'
    );
    this.message = new Label(
      page.getByRole('heading', { name: /Welcome to the Secure Area/i }),
      'Success message'
    );
    this.logoutButton = new Button(page.getByText('Logout', { exact: true }), 'Logout link');
  }

  async getMessageText(): Promise<string> {
    return await this.message.getText();
  }

  async clickLogoutButton(): Promise<void> {
    await this.logoutButton.click();
  }
}
