import config from '../../playwright.config';
import { defineConfig } from '@playwright/test';
export default defineConfig({ ...config, testDir: '../../tests/browser', use: { ...config.use, baseURL: 'http://127.0.0.1:3105' }, webServer: { command: 'npm run start -- --hostname 127.0.0.1 --port 3105', url: 'http://127.0.0.1:3105', reuseExistingServer: true, timeout: 120000 } });
