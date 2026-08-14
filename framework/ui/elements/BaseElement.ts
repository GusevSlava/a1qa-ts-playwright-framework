import { test, Locator } from '@playwright/test';
import Timeouts from '../constants/Timeouts.js';
import ElementStateHandler from './helpers/elementState.js';
import { ElementUtils } from './helpers/ElementUtils.js';

interface BoundingRect {
  top: number,
  left: number,
  right: number,
  bottom: number,
  width: number,
  height: number,
}

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

  /**
   * Injects HTML into the element using insertAdjacentHTML, encapsulated within a reporting step.
   * @param position - Where to insert: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'
   * @param html - HTML string to inject
   */
  async insertHTML(position: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend', html: string): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Insert HTML: ${position}`, async () => {
      await this.locator.evaluate(
      (element, args) => {
          (element as any).insertAdjacentHTML(args.position, args.html);
      },
      { html, position }
      );
    });
  }

  /**
   * Executes a click by position action encapsulated within a reporting step.
   * @param position - Position to click: 'left' | 'right' | 'top' | 'bottom'
   */
  async clickByPosition(position: 'left' | 'right' | 'top' | 'bottom' | 'center'): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Click by ${position} position`, async () => {
      const offset = await ElementUtils.calculateOffset(this.locator, position);
      await this.locator.click({ position: offset });
    });
  }

  async getElementRect(): Promise<BoundingRect> {
    return test.step(`${this._type} '${this._name}' — Get element bounding rectangle`, async () => {
      return this.locator.evaluate(el => {
        const r = el.getBoundingClientRect();
        return {
          top: r.top,
          left: r.left,
          right: r.right,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
        };
      });
    });
  }
}
