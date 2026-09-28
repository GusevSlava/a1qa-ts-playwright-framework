import { test, Locator } from '@playwright/test';
import ElementType from '../constants/ElementType.js';
import BaseElement from './BaseElement.js';

export class Checkbox extends BaseElement {
  /**
   * Initializes a Checkbox element with a specific locator and name for reporting.
   */
  constructor(locator: Locator, name: string) {
    super(locator, name);
    this._type = ElementType.CHECKBOX;
  }

  /**
   * Ensures that the checkbox is checked, encapsulated within a reporting step.
   */
  async check(): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Check`, async () => {
      await this.locator.check();
    });
  }

  /**
   * Ensures that the checkbox is unchecked, encapsulated within a reporting step.
   */
  async uncheck(): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Uncheck`, async () => {
      await this.locator.uncheck();
    });
  }

  /**
   * Verify checkbox status.
   */
  async isChecked(): Promise<boolean> {
    return test.step(`${this._type} '${this._name}' — Get checkbox status`, async () => {
      return this.locator.isChecked();
    });
  }
}
