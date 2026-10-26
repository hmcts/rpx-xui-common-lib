import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-standalone-components-demo',
  templateUrl: './standalone-components-demo.component.html',
  standalone: false
})
export class StandaloneComponentsDemoComponent {
  public readonly form = new FormGroup({
    choice: new FormControl('first'),
    consent: new FormControl(false)
  });

  public readonly radioOptions = {
    key: 'choices',
    group: this.form,
    config: {
      id: 'choices',
      key: 'choices',
      legend: 'Preferred route',
      hint: 'Choose one route.'
    },
    errors: null as { isInvalid: boolean; messages: string[] } | null,
    items: [
      { id: 'first-route', name: 'choice', value: 'first', label: 'First route' },
      { id: 'second-route', name: 'choice', value: 'second', label: 'Second route' }
    ]
  };

  public readonly checkboxConfig = {
    id: 'consent',
    value: 'consent',
    label: 'Email updates',
    name: 'consent',
    hint: 'Receive status updates.',
    focusOn: 'consent-checkbox',
    optional: true
  };

  public showTitle = true;
  public showBackLink = true;
  public showCaption = true;
  public showRadioError = false;

  public toggleTitle(): void {
    this.showTitle = !this.showTitle;
  }

  public toggleBackLink(): void {
    this.showBackLink = !this.showBackLink;
  }

  public toggleCaption(): void {
    this.showCaption = !this.showCaption;
  }

  public toggleRadioError(): void {
    this.showRadioError = !this.showRadioError;
  }

  public get radioError() {
    return this.showRadioError ? { isInvalid: true, messages: ['Choose a route'] } : null;
  }
}
