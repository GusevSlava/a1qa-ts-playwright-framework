import fs from 'fs/promises';
import { test } from '@playwright/test';

export default class FileUtils {
  /**
   * Checks if a file exists at the specified path, encapsulated within a reporting step.
   * Do not use this function alone for assertions!
   * Wrap it in expect.poll for stable checks (eliminates flaky tests).
   *
   * @example
   * await expect.poll(async () => await FileUtils.isFileExists(filePath)).toBeTruthy();
   *
   * @param filePath - Absolute path to the file.
   */
  static async isFileExists(filePath: string): Promise<boolean> {
    return await test.step(`File Utils — Check if file exists: "${filePath}"`, async () => {
      try {
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    });
  }

  /**
   * Safely creates a directory if it does not exist, encapsulated within a reporting step.
   * @param dirPath - Path to the directory.
   */
  static async ensureDirectoryExists(dirPath: string): Promise<void> {
    await test.step(`File Utils — Ensure directory exists: "${dirPath}"`, async () => {
      try {
        await fs.access(dirPath);
      } catch {
        await fs.mkdir(dirPath, { recursive: true });
      }
    });
  }
}
