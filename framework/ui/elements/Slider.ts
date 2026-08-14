import { test, Locator } from '@playwright/test';
import ElementType from '../constants/ElementType.js';
import BaseElement from './BaseElement.js';

export class Slider extends BaseElement {
  /**
   * Initializes a TextBox element with a specific locator and name for reporting.
   */
  constructor(locator: Locator, name: string) {
    super(locator, name);
    this._type = ElementType.SLIDER;
  }

  private sliderValue = new BaseElement(this.locator.locator('xpath=..').locator('#range'), 'Slider value');

  /**
   * Sets the value of the input element programmatically (equivalent to pasting).
   * Faster than typeText(), but does not trigger per-character keyboard events.
   * @param text - Text to set
   */
  async changeValueByKeyboard(direction: 'up' | 'down'): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Set text: "${direction}"`, async () => {
      let key;
      if (direction === 'up') {
        key = 'ArrowRight'
      } else {
        key = 'ArrowLeft'
      }
      await this.locator.press(key);
    });
  }

  /**
   * Gets the value of the input element, encapsulated within a reporting step.
   * @returns Value from element
   */
  async getValue(): Promise<string> {
    return await test.step(`${this._type} '${this._name}' — Get value`, async () => {
      return this.sliderValue.getText();
    });
  }

  /**
   * Sets the value of the input element programmatically (equivalent to pasting).
   * Faster than typeText(), but does not trigger per-character keyboard events.
   * @param text - Text to set
   */
  async changeValueByDragAndDrop(value: number): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Move handle by "${value}" pixels`, async () => {
      await this.locator.dragTo(this.locator, { targetPosition: {x: value, y: 5}})
    });
  }

  /**
   * Sets the value of the input element programmatically (equivalent to pasting).
   * Faster than typeText(), but does not trigger per-character keyboard events.
   * @param text - Text to set
   */
  async changeValueByMouse(value: number): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Move handle by "${value}" pixels`, async () => {
      await this.locator.dragTo(this.locator, { targetPosition: {x: value, y: 5}})
    });
  }

  async getMaxValue(): Promise<number> {
    return await test.step(`${this._type} '${this._name}' — Get max value`, async () => {
      return Number(await this.locator.getAttribute('max'));
    });
  }
}
