import { Component } from '@angular/core';
import { FilterConfig, TCDocument, UserDetails } from 'projects/exui-common-lib/src';
import { FilterService } from 'projects/exui-common-lib/src/lib/services';

@Component({
  selector: 'app-coverage-demo',
  templateUrl: './coverage-demo.component.html',
  standalone: false
})
export class CoverageDemoComponent {
  public readonly feature = new URLSearchParams(window.location.search).get('feature');
  public readonly cookieIdentifier = 'commonlib-coverage-cookie';
  public readonly filterConfig: FilterConfig = {
    id: 'commonlib-coverage-filter',
    persistence: 'session',
    applyButtonText: 'Apply filters',
    showCancelFilterButton: true,
    cancelButtonText: 'Cancel changes',
    fields: [
      {
        name: 'service',
        title: 'Service',
        type: 'checkbox',
        minSelected: 1,
        maxSelected: 2,
        options: [
          { key: 'civil', label: 'Civil' },
          { key: 'family', label: 'Family' }
        ]
      },
      {
        name: 'priority',
        title: 'Priority',
        type: 'radio',
        minSelected: 0,
        maxSelected: 0,
        options: [
          { key: 'urgent', label: 'Urgent' },
          { key: 'normal', label: 'Normal' }
        ]
      },
      {
        name: 'region',
        title: 'Region',
        type: 'select',
        minSelected: 0,
        maxSelected: 0,
        options: [
          { key: 'london', label: 'London' },
          { key: 'north', label: 'North' }
        ]
      }
    ]
  };

  public readonly filterSettings$ = this.filterService.getStream(this.filterConfig.id);
  public readonly users: UserDetails[] = [
    { idamId: 'demo-alex', firstName: 'Alex', lastName: 'Taylor', email: 'alex@example.test' },
    { idamId: 'demo-sam', firstName: 'Sam', lastName: 'Morgan', email: 'sam@example.test' }
  ];

  public readonly primaryNavigationItems = [
    { active: true, href: '/coverage', text: 'Coverage examples' },
    { active: false, href: '/home', text: 'Home demo' }
  ];

  public readonly subNavigationItems = [
    { active: true, href: '/coverage', text: 'Current section', roundel: 2 },
    { active: false, href: '/home', text: 'Other section' }
  ];

  public errorMessages: { id: string; message: string }[] = [];

  public firstRecord = 1;
  public moreItems = true;
  public selectedUserEmail = 'No user selected';
  public termsConfirmed = false;

  public readonly termsHtmlDocument: TCDocument = {
    version: 1,
    content: '<h2>HTML terms</h2><p>Safe <strong>content</strong>.</p><script>window.__termsScript = true;</script>',
    mimeType: 'text/html'
  };

  public readonly termsPlainDocument: TCDocument = {
    version: 1,
    content: 'Plain terms content.',
    mimeType: 'text/plain'
  };

  public readonly termsUnknownDocument: TCDocument = {
    version: 1,
    content: 'Unsupported terms content.',
    mimeType: 'application/octet-stream'
  };

  public readonly formGroupError = { isInvalid: true, messages: ['Choose at least one option'] };
  public readonly formGroupConfig = {
    id: 'wrapped-options',
    key: 'wrapped-options',
    legend: 'Wrapped options',
    hint: 'The wrapper owns this hint.'
  };

  constructor(private readonly filterService: FilterService) { }

  public nextPage(): void {
    this.firstRecord += 10;
    this.moreItems = this.firstRecord < 21;
  }

  public previousPage(): void {
    this.firstRecord = Math.max(1, this.firstRecord - 10);
    this.moreItems = true;
  }

  public selectUser(user: UserDetails | null): void {
    this.selectedUserEmail = user ? user.email : 'No user selected';
  }

  public showErrors(): void {
    this.errorMessages = [
      { id: 'coverage-email', message: 'Enter an email address' },
      { id: 'missing-field', message: 'Check your details' }
    ];
  }
}
