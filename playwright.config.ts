import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load .env early so all env vars are available for config and framework code.
// dotenv.config() will not overwrite vars already set in the shell/CI environment.
dotenv.config();

const isCI = !!process.env.CI;
const targetBrowser = process.env.BROWSER || 'chromium';

const allProjects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
  {
    name: 'local-headed',
    use: {
      browserName: 'chromium' as const,
      headless: false,
      viewport: null,
      launchOptions: {
        args: ['--start-maximized'],
      },
    },
  },
];

const config: PlaywrightTestConfig = {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ...(isCI ? [['junit', { outputFile: 'results.xml' }] as const] : [])
  ],

  use: {
    headless: isCI ? true : (process.env.HEADLESS !== 'false'),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',

    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    acceptDownloads: true,
  },

  projects: targetBrowser === 'all' ? allProjects : allProjects.filter(p => p.name === targetBrowser),
};

export default config;
