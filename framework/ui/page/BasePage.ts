import { test, Page } from '@playwright/test';
import Timeouts from '../constants/Timeouts.js';
import BaseElement from '../elements/BaseElement.js';

export default class BasePage {
  protected uniqueElement: BaseElement;
  protected _name: string;

  /**
   * Initializes a BasePage with a unique element to identify it and a name for reporting.
   * @param uniqueElement - A unique element that identifies the page
   * @param name - Name of the page for logging/reporting
   */
  constructor(uniqueElement: BaseElement, name: string) {
    if (!(uniqueElement instanceof BaseElement)) {
      throw new Error('uniqueElement must be a child of BaseElement');
    }
    this.uniqueElement = uniqueElement;
    this._name = name;
  }

  /**
   * Gets the name of the page.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Waits for the page to load by waiting for its unique element to be displayed, encapsulated within a reporting step.
   * @param timeout - Timeout in milliseconds
   */
  async waitForPageToLoad(timeout: number = Timeouts.WAIT_PAGE_LOAD): Promise<void> {
    await test.step(`Page '${this._name}' — Wait to load`, async () => {
      await this.uniqueElement.waitForDisplayed(timeout);
    });
  }

  /**
   * Checks if the page is opened using a fast non-blocking visibility check, encapsulated within a reporting step.
   */
  async isPageOpened(): Promise<boolean> {
    return await test.step(`Page '${this._name}' — Check if opened`, async () => {
      return await this.uniqueElement.state.isVisible();
    });
  }
}
