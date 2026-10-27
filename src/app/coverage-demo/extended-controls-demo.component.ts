import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterConfigOption } from 'projects/exui-common-lib/src/public-api';

@Component({
  selector: 'app-extended-controls-demo',
  templateUrl: './extended-controls-demo.component.html',
  standalone: false
})
export class ExtendedControlsDemoComponent {
  public readonly form = new FormGroup({
    name: new FormControl(''),
    selections: new FormControl<string[]>(['alpha'])
  });

  public readonly addressForm = new FormGroup({
    address: new FormGroup({
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      addressLine3: new FormControl(''),
      postTown: new FormControl('', Validators.required),
      county: new FormControl(''),
      postCode: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    })
  });

  public readonly checkboxConfig = {
    id: 'service-selections',
    name: 'selections',
    legend: 'Services',
    hint: 'Select the services that apply.',
    rows: 2
  };

  public readonly checkboxItems = [
    { id: 'alpha-service', value: 'alpha', label: 'Alpha service' },
    { id: 'beta-service', value: 'beta', label: 'Beta service', hint: 'A second option.' },
    { id: 'gamma-service', value: 'gamma', label: 'Gamma service' }
  ];

  public readonly serviceOptions: FilterConfigOption[] = [
    { key: 'alpha', label: 'Alpha service' },
    { key: 'civil', label: 'Civil Money Claims' },
    { key: 'family', label: 'Family Public Law' }
  ];

  public selectedServices: FilterConfigOption[] = [this.serviceOptions[0]];
  public searchTerm = '';
  public inputErrorEnabled = false;
  public checkboxErrorEnabled = false;
  public addressSubmissionAttempted = false;
  public international = false;

  public get inputError() {
    return this.inputErrorEnabled ? { isInvalid: true, messages: ['Enter a full name'] } : null;
  }

  public get checkboxError() {
    return this.checkboxErrorEnabled ? { isInvalid: true, messages: ['Choose at least one service'] } : null;
  }

  public toggleInputError(): void {
    this.inputErrorEnabled = !this.inputErrorEnabled;
  }

  public toggleCheckboxError(): void {
    this.checkboxErrorEnabled = !this.checkboxErrorEnabled;
  }

  public toggleAddressSubmission(): void {
    this.addressSubmissionAttempted = !this.addressSubmissionAttempted;
  }

  public toggleInternational(): void {
    this.international = !this.international;
  }

  public selectService(service: FilterConfigOption): void {
    if (service && !this.selectedServices.some((selected) => selected.key === service.key)) {
      this.selectedServices = [...this.selectedServices, service];
    }
    this.searchTerm = '';
  }
}
