import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterFieldConfig } from '../../models';

@Component({
  selector: 'xuilib-find-service',
  templateUrl: './find-service.component.html',
  styleUrls: ['./find-service.component.scss']
})
export class FindServiceComponent  {
    @Input() public field: FilterFieldConfig;
    @Input() public fields: FilterFieldConfig[];
    @Input() public serviceTitle = 'Search for a service by name';
    @Input() public form: FormGroup;
    @Input() public services: any;
    @Input() public selectedServices: any;
    @Input() public disabled: any;
    @Input() public enableAddServiceButton: boolean = true;
    @Input() public disableInputField = false;

    constructor(private readonly fb: FormBuilder) {
      this.form = this.fb.group({
        searchTerm: ['']
      });
    }

    public addService() {
      // Todo
    }
}
