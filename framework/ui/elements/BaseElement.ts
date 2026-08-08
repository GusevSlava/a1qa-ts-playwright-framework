import { test, Locator } from '@playwright/test';
import Timeouts from '../constants/Timeouts.js';
import ElementStateHandler from './helpers/elementState.js';

export default class BaseElement {
  protected _locator: Locator;
  protected _name: string;
  protected _type: string;

  constructor(locator: Locator, name: string) {
    this._locator = locator;
    this._name = name;
    this._type = 'Element';
  }

  get locator(): Locator {
    return this._locator;
  }

  get state(): ElementStateHandler {
    return new ElementStateHandler(this.locator, this._name);
  }

  /**
   * Executes a click action encapsulated within a reporting step.
   */
  async click(): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Click`, async () => {
      await this.locator.click();
    });
  }

  /**
   * Retrieves the inner text of the element encapsulated within a reporting step.
   */
  async getText(): Promise<string> {
    return await test.step(`${this._type} '${this._name}' — Get text`, async () => {
      await this.waitForDisplayed();
      return await this.locator.innerText();
    });
  }

  /**
   * Moves the mouse cursor over the element encapsulated within a reporting step.
   */
  async moveTo(): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Hover`, async () => {
      await this.locator.hover();
    });
  }

  /**
   * Waits for the element to become visible encapsulated within a reporting step.
   * @param timeout - Timeout in milliseconds
   */
  async waitForDisplayed(timeout: number = Timeouts.EXPLICIT_WAIT): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Wait for element to be displayed`, async () => {
      await this.locator.waitFor({ state: 'visible', timeout });
    });
  }
}
