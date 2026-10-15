import config from '../playwright.config';
import { defineConfig } from '@playwright/test';
export default defineConfig({ ...config, testDir: '../tests/browser', use: { ...config.use, baseURL: 'http://localhost:3100' }, webServer: { command: 'npm run start -- --hostname localhost --port 3100', url: 'http://localhost:3100', reuseExistingServer: true, timeout: 120000 } });
