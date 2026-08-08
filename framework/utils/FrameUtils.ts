import { Page, Locator } from '@playwright/test';

export default class FrameUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Resolve a locator inside nested frames
   * @param frameSelectors - ordered outer → inner
   * @param targetSelector - selector for target element
   */
  locatorInFrames(frameSelectors: string[], targetSelector: string): Locator {
    let frame: any = this.page;

    for (const selector of frameSelectors) {
      frame = frame.frameLocator(selector);
    }

    return frame.locator(targetSelector);
  }
}
