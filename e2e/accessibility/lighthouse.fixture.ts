import { chromium, Page } from '@playwright/test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test as base } from '../src/browser-diagnostics.fixture';

export const test = base.extend<{ lighthousePage: Page; lighthousePort: number }>({
  lighthousePage: async ({ browserName }, use) => {
    if (browserName !== 'chromium') {
      throw new Error('Lighthouse requires Chromium CDP');
    }
    const profile = await mkdtemp(join(tmpdir(), 'commonlib-lighthouse-'));
    const context = await chromium.launchPersistentContext(profile, {
      headless: true, args: ['--remote-debugging-port=0'], viewport: { width: 1280, height: 720 }
    });
    try {
      const page = context.pages()[0];
      const port = Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
      lighthousePorts.set(page, port);
      await use(page);
    } finally {
      await context.close();
      await rm(profile, { recursive: true, force: true });
    }
  },
  lighthousePort: async ({ lighthousePage }, use) => {
    await use(lighthousePorts.get(lighthousePage));
  }
});
const lighthousePorts = new WeakMap<Page, number>();
