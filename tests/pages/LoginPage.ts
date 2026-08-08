import { Button, TextBox, Label, Locator } from '#framework/ui/elements/index.js';
import BasePage from '#framework/ui/page/BasePage.js';
import { Page } from '@playwright/test';

export default class LoginPage extends BasePage {
  private usernameInput: TextBox;
  private passwordInput: TextBox;
  private loginButton: Button;

  constructor(page: Page) {
    super(
      new Label(page.getByRole('heading', { name: 'Login Page' }), 'login page unique locator'),
      'Login Page'
    );
    this.usernameInput = new TextBox(page.getByLabel('Username'), 'Username input');
    this.passwordInput = new TextBox(page.getByLabel('Password'), 'Password input');
    this.loginButton = new Button(page.getByRole('button', { name: 'Login' }), 'Login button');
  }

  async typeUsername(username: string): Promise<void> {
    await this.usernameInput.setText(username);
  }

  async typePassword(password: string): Promise<void> {
    await this.passwordInput.setText(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }
}
