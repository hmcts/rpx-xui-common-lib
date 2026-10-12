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

  test.describe('service message and document components', () => {
    test('should render the service warning and hide-message link', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.serviceMessage).toContainText(
        'This is a test xuilib-service-message for the ExUI Common Lib Test Page'
      );
      await expect(appPage.hideMessageLink).toBeVisible();
    });

    test('should expose warning semantics for the service message', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.serviceWarningIcon).toHaveAttribute('role', 'img');
      await expect(appPage.serviceWarningIcon).toHaveAttribute('aria-label', 'hmcts-warning-icon');
      await expect(appPage.serviceMessage).toContainText('Warning');
    });

    test('should render the plain terms and conditions document', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.termsDocument(0)).toHaveText('Test Document Content');
      await expect(appPage.termsDocument(0).locator('b')).toHaveCount(0);
    });

    test('should render HTML terms and conditions content as markup', async ({ page }) => {
      const appPage = new AppPage(page);
      const document = appPage.termsDocument(1);

      await expect(document.getByRole('heading', { name: 'HTML Test', level: 1 })).toBeVisible();
      await expect(document).toContainText('Document to test HTML content');
      await expect(document.locator('b')).toHaveText('HTML');
    });

    test('should select the renderer that matches each document mime type', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.termsDocument(0).locator('xuilib-tc-display-plain')).toHaveCount(1);
      await expect(appPage.termsDocument(0).locator('xuilib-tc-display-html')).toHaveCount(0);
      await expect(appPage.termsDocument(1).locator('xuilib-tc-display-html')).toHaveCount(1);
      await expect(appPage.termsDocument(1).locator('xuilib-tc-display-plain')).toHaveCount(0);
    });
  });

  test.describe('contact details component', () => {
    test('should render the contact title and badge', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.contactDetails.getByRole('heading', { name: 'Contact Details Component' })).toBeVisible();
      await expect(appPage.contactDetails.locator('.hmcts-badge')).toHaveText('PRIVATE BETA');
      await expect(appPage.contactDetails.locator('.hmcts-badge')).toHaveClass(/hmcts-badge--red/);
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

    test('should expose both tab labels and a single active tab', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(page.getByRole('tab')).toHaveCount(2);
      await expect(page.getByRole('tab', { selected: true })).toHaveCount(1);
      await expect(appPage.tab('Tab1')).toHaveAttribute('aria-selected', 'true');
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

    test('should use the singular overdue label for one day late', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.dueDateInput.fill(dateBeforeDays(1));
      await expect(appPage.dueDateBadge).toHaveText('+1 day');
      await expect(appPage.dueDateBadge).toHaveAttribute('aria-label', 'This task is 1 day past its due date');
    });

    test('should mark a distant future date green when no urgency cutoff applies', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.highUrgencyCutoffInput.fill('0');
      await appPage.mediumUrgencyCutoffInput.fill('0');
      await appPage.dueDateInput.fill(dateAfterDays(10));

      await expect(appPage.dueDateBadge).toHaveClass(/hmcts-badge--green/);
      await expect(appPage.dueDateBadge).toHaveAttribute('aria-label', /due to be completed by/);
    });

    test('should render the formatted date for a future due date', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.highUrgencyCutoffInput.fill('0');
      await appPage.mediumUrgencyCutoffInput.fill('0');
      await appPage.dueDateInput.fill(dateAfterDays(10));

      await expect(appPage.dueDateBadge).toHaveText('22 Oct');
      await expect(appPage.dueDateBadge).toHaveAttribute(
        'aria-label',
        'This task is due to be completed by 22 October 2026'
      );
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

    test('should keep a date at the high cutoff out of the red state', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.highUrgencyCutoffInput.fill('1');
      await appPage.mediumUrgencyCutoffInput.fill('2');
      await appPage.dueDateInput.fill(dateAfterDays(1));

      await expect(appPage.dueDateBadge).toHaveClass(/hmcts-badge--orange/);
      await expect(appPage.dueDateBadge).not.toHaveClass(/hmcts-badge--red/);
    });

    test('should retain the last valid due date when invalid input is entered', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.dueDateBadge).toHaveText('TODAY');
      await appPage.dueDateInput.fill('not-a-date');

      await expect(appPage.dueDateBadge).toHaveText('TODAY');
      await expect(appPage.dueDateBadge).toHaveAttribute(
        'aria-label',
        'This task is due to be completed today'
      );
    });
  });

  test.describe('checkbox list component', () => {
    test('should add and remove the Wimbledon checkbox option', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.wimbledonCheckbox).toHaveCount(0);

      await appPage.addWimbledonButton.click();
      await expect(appPage.wimbledonCheckbox).toBeVisible();
      await expect(appPage.wimbledonCheckbox).not.toBeChecked();

      await appPage.removeWimbledonButton.click();
      await expect(appPage.wimbledonCheckbox).toHaveCount(0);
    });

    test('should render every location and the preselected location', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.checkboxOptions).toHaveCount(7);
      await expect(appPage.checkbox('Select all / Deselect all')).not.toBeChecked();
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

    test('should remove and restore an individual selected location', async ({ page }) => {
      const appPage = new AppPage(page);
      const twickenham = appPage.checkbox('Twickenham');

      await expect(twickenham).toBeChecked();
      await twickenham.uncheck();
      await expect(twickenham).not.toBeChecked();
      await twickenham.check();
      await expect(twickenham).toBeChecked();
      await expect(appPage.checkboxEvents).toContainText('Selection changed to:');
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

    test('should select a dynamically added location', async ({ page }) => {
      const appPage = new AppPage(page);

      await appPage.addWimbledonButton.click();
      await expect(appPage.wimbledonCheckbox).toBeVisible();
      await appPage.wimbledonCheckbox.check();
      await expect(appPage.wimbledonCheckbox).toBeChecked();
      await expect(appPage.checkboxEvents).toContainText('Wimbledon');
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

    test('should apply every supported checkbox list height', async ({ page }) => {
      const appPage = new AppPage(page);

      for (const height of ['000', '080', '050']) {
        await appPage.listHeightSelect.selectOption(height);
        await expect(appPage.checkboxList).toHaveClass(new RegExp(`h_${height}`));
      }
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

    test('should switch the spinner control between start and stop states', async ({ page }) => {
      const appPage = new AppPage(page);

      await expect(appPage.startSpinnerButton).toBeVisible();
      await expect(appPage.stopSpinnerButton).toHaveCount(0);

      await appPage.startSpinnerButton.click();
      await expect(appPage.stopSpinnerButton).toBeVisible();
      await expect(appPage.startSpinnerButton).toHaveCount(0);

      await appPage.stopSpinnerButton.click();
      await expect(appPage.startSpinnerButton).toBeVisible();
      await expect(appPage.stopSpinnerButton).toHaveCount(0);
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

function dateBeforeDays(days: number): string {
  return dateAfterDays(-days);
}

function isKnownBrowserDiagnostic(message: string, url: string, browserName: string): boolean {
  return (
    (browserName === 'firefox' && message.startsWith('[JavaScript Error: "downloadable font:')) ||
    (browserName === 'webkit' && url === 'https://www.googletagmanager.com/gtm.js?id=GTM-1234')
  );
}
