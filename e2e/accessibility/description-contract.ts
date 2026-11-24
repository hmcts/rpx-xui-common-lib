import type { Page } from '@playwright/test';
import type { ScreenReaderLikeViolation } from './screenReaderLikeAccessibility';

export interface DescriptionContract {
  selector: string;
  describedBy: string;
  targets: Array<{ id: string; text: string }>;
  absentIds: string[];
}

// Collection only: component-specific relationships join the existing heuristic evidence.
export async function collectDescriptionViolations(page: Page, contracts: DescriptionContract[]): Promise<ScreenReaderLikeViolation[]> {
  return page.evaluate((expected) => expected.flatMap((contract) => {
    const control = document.querySelector(contract.selector);
    if (!control) {
      throw new Error(`Description contract setup: missing control ${contract.selector}`);
    }
    const problems: string[] = [];
    if (control.getAttribute('aria-describedby') !== contract.describedBy) {
      problems.push(`Expected aria-describedby="${contract.describedBy}", received "${control.getAttribute('aria-describedby')}".`);
    }
    for (const target of contract.targets) {
      const element = document.getElementById(target.id);
      const actual = element?.textContent?.replace(/\s+/g, ' ').trim();
      if (actual !== target.text) {
        problems.push(`Expected #${target.id} text "${target.text}", received ${element ? JSON.stringify(actual) : 'missing target'}.`);
      }
    }
    for (const id of contract.absentIds) {
      if (document.getElementById(id)) {
        problems.push(`Expected cleared description target #${id} to be absent.`);
      }
    }
    return problems.length ? [{ rule: 'component-description', message: problems.join(' '), selector: contract.selector, html: control.outerHTML }] : [];
  }), contracts);
}
