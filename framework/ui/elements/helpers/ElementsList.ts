import { test, Locator } from '@playwright/test';

export class ElementsList<T> {
  private locator: Locator;
  private name: string;
  private ElementType: new (locator: Locator, name: string) => T;

  /**
   * Initializes an ElementsList to manage multiple identical elements.
   * @param locator - Playwright locator for the collection
   * @param name - Name for logging/reporting
   * @param ElementType - The element class constructor (e.g., Button)
   */
  constructor(locator: Locator, name: string, ElementType: new (locator: Locator, name: string) => T) {
    this.locator = locator;
    this.name = name;
    this.ElementType = ElementType;
  }

  /**
   * Gets a specific element from the list by index.
   * Returns an instance of the ElementType (e.g., a new Button).
   * @param index - Index of the element
   */
  getByIndex(index: number): T {
    const specificLocator = this.locator.nth(index);
    return new this.ElementType(specificLocator, `${this.name} [${index}]`);
  }

  /**
   * Gets the number of elements in the list, encapsulated within a reporting step.
   */
  async getCount(): Promise<number> {
    return await test.step(`ElementsList '${this.name}' — Get count`, async () => {
      return await this.locator.count();
    });
  }

  /**
   * Gets the text content of all elements in the list, encapsulated within a reporting step.
   * @param expectedCount - Optional expected number of elements. When provided,
   *   waits until that many elements are present to avoid reading a partially-rendered list.
   */
  async getAllTexts(expectedCount?: number): Promise<string[]> {
    return await test.step(`ElementsList '${this.name}' — Get all texts`, async () => {
      if (typeof expectedCount === 'number' && expectedCount > 0) {
        // Use type assertion since T might not have waitForDisplayed
        await (this.getByIndex(expectedCount - 1) as any).waitForDisplayed();
      } else {
        const count = await this.getCount();
        if (count > 0) {
          await (this.getByIndex(0) as any).waitForDisplayed();
        }
      }

      return await this.locator.allInnerTexts();
    });
  }

  /**
   * Iterates over the elements and performs an action, encapsulated within a reporting step.
   * @param action - Async function taking (element, index)
   */
  async executeForEach(action: (element: T, index: number) => Promise<void>): Promise<void> {
    await test.step(`ElementsList '${this.name}' — Execute action for each element`, async () => {
      const count = await this.getCount();
      for (let i = 0; i < count; i++) {
        const element = this.getByIndex(i);
        await action(element, i);
      }
    });
  }
}
