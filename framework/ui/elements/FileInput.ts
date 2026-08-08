import { test, Locator } from '@playwright/test';
import BaseElement from './BaseElement.js';
import ElementType from '../constants/ElementType.js';

export class FileInput extends BaseElement {
  /**
   * Initializes a FileInput element with a specific locator and name for reporting.
   */
  constructor(locator: Locator, name: string) {
    super(locator, name);
    this._type = ElementType.FILE_INPUT;
  }

  /**
   * Uploads a file into the <input type="file"> element, encapsulated within a reporting step.
   * @param filePath - Path to the file to upload
   */
  async uploadFile(filePath: string): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Upload file: "${filePath}"`, async () => {
      await this.locator.setInputFiles(filePath);
    });
  }

  /**
   * Clears the file input element, encapsulated within a reporting step.
   */
  async clear(): Promise<void> {
    await test.step(`${this._type} '${this._name}' — Clear file input`, async () => {
      await this.locator.setInputFiles([]);
    });
  }
}
