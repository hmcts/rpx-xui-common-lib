import { test as base } from '../src/browser-diagnostics.fixture';
import { AccessibilityDemoPage } from './demo.po';

export const test = base.extend<{ demo: AccessibilityDemoPage }>({
  demo: async ({ page }, use) => {
    await use(new AccessibilityDemoPage(page));
  }
});
