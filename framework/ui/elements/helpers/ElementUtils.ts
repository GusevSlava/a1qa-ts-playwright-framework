import { test, Locator } from '@playwright/test';

interface Offset {
  x: number;
  y: number;
}

export class ElementUtils {
  /**
   * Calculates click position offset (x, y) based on position string.
   * Returns pixel offsets relative to element center for use with locator.click({ position })
   *
   * @param locator - Playwright Locator
   * @param position - Position string: 'left' | 'right' | 'top' | 'bottom' | 'center'
   * @returns Offset object with x, y coordinates
   *
   * @example
   * const offset = await ElementUtils.calculateOffset(element.locator, 'left');
   * await element.locator.click({ position: offset });
   */
  static async calculateOffset(locator: Locator, position: 'left' | 'right' | 'top' | 'bottom' | 'center'): Promise<Offset> {
    return await locator.evaluate((element, pos) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      switch (pos) {
        case 'left':
          return { x: 5, y: centerY };
        case 'right':
          return { x: width - 5, y: centerY };
        case 'top':
          return { x: centerX + 5, y: 5 };
        case 'bottom':
          return { x: centerX + 5, y: height - 5 };
        default:
          return { x: centerX, y: centerY };
      }
    }, position);
  }
}
