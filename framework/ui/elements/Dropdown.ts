import { test, Locator } from '@playwright/test';
import ElementType from '../constants/ElementType.js';
import BaseElement from './BaseElement.js';

export class Dropdown extends BaseElement {
  /**
   * Initializes a Dropdown element with a specific locator and name for reporting.
   */
  constructor(locator: Locator, name: string) {
    super(locator, name);
    this._type = ElementType.DROPDOWN;
  }

  /**
   * Selects an option in the <select> element, encapsulated within a reporting step.
   * @param option - Option value to select
   */
  async selectOption(option: string): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Select option: "${option}"`, async () => {
      await this.locator.selectOption(option);
    });
  }
}
