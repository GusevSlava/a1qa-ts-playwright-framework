import { test as base, expect, TestFixture, TestInfo } from '@playwright/test';
import Browser from '../browser/Browser.js';
import fs from 'fs/promises';
import path from 'path';
import EnvProvider from '../../utils/EnvProvider.js';

interface CustomFixtures {
  customBrowser: Browser;
}

/**
 * Base custom test fixture providing an isolated Browser wrapper instance.
 * Inherits native Playwright configuration (e.g., viewport, video, acceptDownloads).
 */
export const test = base.extend<CustomFixtures>({
  customBrowser: async ({ page, baseURL }, use, testInfo: TestInfo) => {
    const workerDownloadDir = path.join(testInfo.outputDir, 'downloads');

    await fs.mkdir(workerDownloadDir, { recursive: true });

    const myBrowser = new Browser(page, workerDownloadDir);

    if (baseURL) {
      await myBrowser.openUrl(baseURL);
    }

    await use(myBrowser);

    // Retain download artifacts for failed tests to aid debugging
    if (testInfo.status === 'passed') {
      await fs.rm(workerDownloadDir, { recursive: true, force: true }).catch(() => {});
    }
  },
});

interface CustomFixturesWithAuth extends CustomFixtures {
  httpCredentials: { username: string; password: string };
}

/**
 * Extended test fixture that pre-configures Basic Authentication for the context.
 */
export const testWithAuth = test.extend<CustomFixturesWithAuth>({
  httpCredentials: [
    async ({}, use) => {
      await use({
        username: EnvProvider.basicAuthUser,
        password: EnvProvider.basicAuthPassword,
      });
    },
    { option: true }
  ]
});

export { expect };
