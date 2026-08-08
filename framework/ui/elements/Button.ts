import { Locator } from '@playwright/test';
import ElementType from '../constants/ElementType.js';
import BaseElement from './BaseElement.js';

export class Button extends BaseElement {
  /**
   * Initializes a Button element with a specific locator and name for reporting.
   */
  constructor(locator: Locator, name: string) {
    super(locator, name);
    this._type = ElementType.BUTTON;
  }
}
