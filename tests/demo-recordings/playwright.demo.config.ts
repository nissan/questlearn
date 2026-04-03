import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'https://questlearn-nu.vercel.app',
    headless: false,
    viewport: { width: 1440, height: 900 },
    video: {
      mode: 'on',
      size: { width: 1440, height: 900 },
    },
    launchOptions: {
      args: ['--window-size=1440,900', '--window-position=0,0'],
    },
  },
  outputDir: './videos',
  projects: [
    {
      name: 'Demo',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
