import { Button, Label } from '#framework/ui/elements/index.js';
import BasePage from '#framework/ui/page/BasePage.js';
import { Page } from '@playwright/test';
import BaseElement from '#framework/ui/elements/BaseElement.js';

export default class AddRemovePage extends BasePage {
  private buttonByName: (buttonName: string) => Button;
  private elementById: (id: string) => BaseElement;

  constructor(page: Page) {
    super(
      new Label(page.getByRole('heading', { name: 'Add/Remove Elements' }), 'Add/Remove page unique locator'),
      'Add/Remove Page'
    );
    this.buttonByName = (buttonName: string) => new Button(page.getByRole('button', { name: buttonName }), `${buttonName} button`);
    this.elementById = (id: string) => new BaseElement(page.locator(id), `Element with ${id}`);
  }

  async clickButton(buttonName: string): Promise<void> {
    await this.buttonByName(buttonName).click();
  }

  async isButtonDisplayed(buttonName: string): Promise<Boolean> {
    return this.buttonByName(buttonName).state.isDisplayed();
  }

  async insertHtmlById(id: string, htmlToInsert: string) {
    await this.elementById(id).insertHTML('afterbegin', htmlToInsert);
  }
}
