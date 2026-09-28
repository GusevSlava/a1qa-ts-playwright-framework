import { Checkbox, Label } from '#framework/ui/elements/index.js';
import BasePage from '#framework/ui/page/BasePage.js';
import { Page } from '@playwright/test';

export default class CheckboxesPage extends BasePage {
  private checkboxByIndex: (index: number) => Checkbox;

  constructor(page: Page) {
    super(
      new Label(page.getByRole('heading', { name: 'Checkboxes' }), 'Checkboxes page unique locator'),
      'Add/Remove Page'
    );
    this.checkboxByIndex = (index: number) => new Checkbox(page.getByRole('checkbox').nth(index - 1), `Checkbox`);
  }

  async isCheckedByIndex(index: number) :Promise<boolean> {
    return this.checkboxByIndex(index).isChecked();
  }

  async checkByIndex(index: number) :Promise<void> {
    return this.checkboxByIndex(index).check();
  }

  async uncheckByIndex(index: number) :Promise<void> {
    return this.checkboxByIndex(index).uncheck();
  }
}
