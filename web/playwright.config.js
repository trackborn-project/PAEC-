import { defineConfig, devices } from '@playwright/test';

// Pruebas sobre el build de producción servido con `serve` (sin internet).
// Usa Microsoft Edge instalado (mismo motor Chromium): la descarga de Chromium de Playwright
// falla en esta red. Para usar Chromium: quita `channel` y corre `npx playwright install chromium`.
const navegador = { channel: 'msedge' };
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4180',
    trace: 'off',
  },
  webServer: {
    command: 'npx vite build && npx serve dist -l 4180 --no-clipboard',
    url: 'http://localhost:4180',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], ...navegador, viewport: { width: 1440, height: 900 } } },
    { name: 'movil', use: { ...devices['Pixel 7'], ...navegador, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
