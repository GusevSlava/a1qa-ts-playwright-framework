import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ConfigReader {
  private static _testDataCache: Record<string, any> | null = null;

  /**
   * Lazy loads and caches test data to prevent redundant file I/O operations.
   */
  static getTestData(): Record<string, any> {
    if (ConfigReader._testDataCache === null) {
      const testDataPath = path.resolve(__dirname, '../config/testdata.json');
      const rawData = fs.readFileSync(testDataPath, 'utf-8');
      ConfigReader._testDataCache = JSON.parse(rawData);
    }
    return ConfigReader._testDataCache;
  }
}
