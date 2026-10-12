import { expect, test as base } from '@playwright/test';
import { AppPage } from './app.po';

const fixedTestDate = new Date('2026-10-12T12:00:00Z');

const test = base.extend<{ browserDiagnostics: string[] }>({
  browserDiagnostics: async ({ page, browserName }, use) => {
    const errors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error' && !isKnownBrowserDiagnostic(message.text(), message.location().url, browserName)) {
        errors.push(`console: ${message.text()} (${message.location().url})`);
      }
    });
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

    await use(errors);
  },
});

test.describe('workspace-project App', () => {
  test.beforeEach(async ({ page, browserDiagnostics }) => {
    void browserDiagnostics;
    await page.clock.setFixedTime(fixedTestDate);
    await new AppPage(page).navigateTo();
  });

  test.afterEach(async ({ browserDiagnostics }) => {
    expect(browserDiagnostics).toEqual([]);
  });

  test('should display welcome message', async ({ page }) => {
    const appPage = new AppPage(page);
    await expect(page).toHaveTitle(/RpxXuiCommonLib/);
    await expect(appPage.heading).toHaveText('ExUI Common Lib Test Page');
  });

  test('should add and remove the Wimbledon checkbox option', async ({ page }) => {
    const appPage = new AppPage(page);
    await expect(appPage.wimbledonCheckbox).toHaveCount(0);

    await appPage.addWimbledonButton.click();
    await expect(appPage.wimbledonCheckbox).toBeVisible();

    await appPage.removeWimbledonButton.click();
    await expect(appPage.wimbledonCheckbox).toHaveCount(0);
  });

  test.describe('service message and document components', () => {
    test('should render the service warning and hide-message link', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.serviceMessage).toContainText(
        'This is a test xuilib-service-message for the ExUI Common Lib Test Page'
      );
      await expect(appPage.hideMessageLink).toBeVisible();
    });

    test('should render the plain terms and conditions document', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.termsDocument(0)).toHaveText('Test Document Content');
    });

    test('should render HTML terms and conditions content as markup', async ({ page }) => {
      const appPage = new AppPage(page);
      const document = appPage.termsDocument(1);

      await expect(document.getByRole('heading', { name: 'HTML Test', level: 1 })).toBeVisible();
      await expect(document).toContainText('Document to test HTML content');
      await expect(document.locator('b')).toHaveText('HTML');
    });
  });

  test.describe('contact details component', () => {
    test('should render the contact title and badge', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.contactDetails.getByRole('heading', { name: 'Contact Details Component' })).toBeVisible();
      await expect(appPage.contactDetails.locator('.hmcts-badge')).toHaveText('PRIVATE BETA');
    });

    test('should render a mailto link for the contact email', async ({ page }) => {
      const appPage = new AppPage(page);
      const emailLink = appPage.contactDetails.getByRole('link', { name: 'test@justice.gov.uk' });

      await expect(emailLink).toHaveAttribute('href', 'mailto:test@justice.gov.uk');
    });

    test('should render the phone number and opening times', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.contactDetails.locator('.phone')).toContainText('1111111');
      await expect(appPage.contactDetails.locator('.opening-times')).toContainText('bla bla bla');
    });
  });

  test.describe('tabs and observable content', () => {
    test('should select Tab1 when the tabs component loads', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.tab('Tab1')).toHaveAttribute('aria-selected', 'true');
      await expect(appPage.tab('Tab2')).toHaveAttribute('aria-selected', 'false');
    });

    test('should switch between tabs', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.tab('Tab2').click();
      await expect(appPage.tab('Tab2')).toHaveAttribute('aria-selected', 'true');
      await expect(appPage.tab('Tab1')).toHaveAttribute('aria-selected', 'false');

      await appPage.tab('Tab1').click();
      await expect(appPage.tab('Tab1')).toHaveAttribute('aria-selected', 'true');
    });

    test('should render the observable list values in order', async ({ page }) => {
      await expect(page.locator('ul').first().locator('li')).toHaveText(['this', 'is', 'a', 'test']);
    });
  });

  test.describe('due date component', () => {
    test('should render today with an accessible urgency label', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.dueDateBadge).toHaveText('TODAY');
      await expect(appPage.dueDateBadge).toHaveClass(/hmcts-badge--orange/);
      await expect(appPage.dueDateBadge).toHaveAttribute('aria-label', 'This task is due to be completed today');
    });

    test('should mark an overdue date red and describe how late it is', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.dueDateInput.fill('01/01/2000');
      await expect(appPage.dueDateBadge).toHaveClass(/hmcts-badge--red/);
      await expect(appPage.dueDateBadge).toHaveText(/\+\d+ days?/);
      await expect(appPage.dueDateBadge).toHaveAttribute('aria-label', /past its due date/);
    });

    test('should mark a distant future date green when no urgency cutoff applies', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.highUrgencyCutoffInput.fill('0');
      await appPage.mediumUrgencyCutoffInput.fill('0');
      await appPage.dueDateInput.fill(dateAfterDays(10));

      await expect(appPage.dueDateBadge).toHaveClass(/hmcts-badge--green/);
      await expect(appPage.dueDateBadge).toHaveAttribute('aria-label', /due to be completed by/);
    });

    test('should mark a near-term date orange at the medium cutoff', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.highUrgencyCutoffInput.fill('0');
      await appPage.mediumUrgencyCutoffInput.fill('2');
      await appPage.dueDateInput.fill(dateAfterDays(1));

      await expect(appPage.dueDateBadge).toHaveClass(/hmcts-badge--orange/);
    });

    test('should mark a near-term date red at the high cutoff', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.highUrgencyCutoffInput.fill('2');
      await appPage.mediumUrgencyCutoffInput.fill('2');
      await appPage.dueDateInput.fill(dateAfterDays(1));

      await expect(appPage.dueDateBadge).toHaveClass(/hmcts-badge--red/);
    });
  });

  test.describe('checkbox list component', () => {
    test('should render every location and the preselected location', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.checkboxOptions).toHaveCount(7);
      await expect(appPage.checkbox('Baker Street')).toBeVisible();
      await expect(appPage.checkbox('Clapham Junction')).toBeVisible();
      await expect(appPage.checkbox("King's Cross")).toBeVisible();
      await expect(appPage.checkbox('Shoreditch High Street')).toBeVisible();
      await expect(appPage.checkbox('South Woodford')).toBeVisible();
      await expect(appPage.checkbox('Twickenham')).toBeChecked();
      await expect(appPage.checkbox('West Brompton')).toBeVisible();
    });

    test('should emit the selected locations when an option is clicked', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.checkbox('Baker Street').check();
      await expect(appPage.checkboxEvents).toContainText('Baker Street');
      await expect(appPage.checkboxEvents).toContainText('Twickenham');
    });

    test('should select and deselect all locations', async ({ page }) => {
      const appPage = new AppPage(page);
      const selectAll = appPage.checkbox('Select all / Deselect all');

      await selectAll.check();
      await expect(selectAll).toBeChecked();
      await expect(appPage.checkboxOptions).toHaveCount(7);
      await expect
        .poll(() => appPage.checkboxOptions.evaluateAll((inputs) => inputs.filter((input) => (input as HTMLInputElement).checked).length))
        .toBe(7);

      await selectAll.uncheck();
      await expect(selectAll).not.toBeChecked();
      await expect
        .poll(() => appPage.checkboxOptions.evaluateAll((inputs) => inputs.filter((input) => (input as HTMLInputElement).checked).length))
        .toBe(0);
    });

    test('should add and remove the Golders Green checkbox option', async ({ page }) => {
      const appPage = new AppPage(page);
      const addButton = page.getByRole('button', { name: 'Add Golders Green option' });
      const removeButton = page.getByRole('button', { name: 'Remove Golders Green option' });
      const checkbox = appPage.checkbox('Golders Green');

      await expect(checkbox).toHaveCount(0);
      await addButton.click();
      await expect(checkbox).toBeVisible();

      await removeButton.click();
      await expect(checkbox).toHaveCount(0);
    });

    test('should switch checkbox labels between names and boroughs', async ({ page }) => {
      const appPage = new AppPage(page);
      const useBoroughButton = page.getByRole('button', { name: 'Use borough for label' });

      await expect(appPage.checkbox('Twickenham')).toBeVisible();
      await useBoroughButton.click();
      await expect(appPage.checkbox('Richmond')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Use name for label' })).toBeVisible();

      await page.getByRole('button', { name: 'Use name for label' }).click();
      await expect(appPage.checkbox('Twickenham')).toBeVisible();
    });

    test('should apply the selected checkbox list height', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.listHeightSelect.selectOption('100');
      await expect(appPage.checkboxList).toHaveClass(/h_100/);
    });
  });

  test.describe('loading spinner component', () => {
    test('should start and stop the loading spinner', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.spinner).toBeHidden();
      await appPage.startSpinnerButton.click();
      await expect(appPage.spinner).toBeVisible();
      await expect(appPage.spinner).toContainText('Loading');

      await appPage.stopSpinnerButton.click();
      await expect(appPage.spinner).toBeHidden();
    });
  });
});

function dateAfterDays(days: number): string {
  const date = new Date(fixedTestDate);
  date.setDate(date.getDate() + days);
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map((value) => value.toString().padStart(2, '0'))
    .join('/');
}

function isKnownBrowserDiagnostic(message: string, url: string, browserName: string): boolean {
  return (
    (browserName === 'firefox' && message.startsWith('[JavaScript Error: "downloadable font:')) ||
    (browserName === 'webkit' && url === 'https://www.googletagmanager.com/gtm.js?id=GTM-1234')
  );
}
