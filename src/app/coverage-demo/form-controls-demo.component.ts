import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorMessagesModel } from 'projects/exui-common-lib/src/public-api';
import { priorityOptions } from './form-controls-demo.data';

@Component({
  selector: 'app-form-controls-demo',
  templateUrl: './form-controls-demo.component.html',
  standalone: false
})
export class FormControlsDemoComponent {
  public readonly priorities = priorityOptions;
  public readonly form = new FormGroup({
    priority: new FormControl('routine'),
    notes: new FormControl(''),
    supportingFile: new FormControl(''),
    untouched: new FormControl('preserved')
  });

  public readonly dateForm = new FormGroup({
    hearing_day: new FormControl(''), hearing_month: new FormControl(''), hearing_year: new FormControl('')
  });

  public showErrors = false;

  public suppliedError(message: string): ErrorMessagesModel | null {
    return this.showErrors ? { isInvalid: true, messages: [message] } : null;
  }

  public get dateError(): ErrorMessagesModel | null {
    return this.dateForm.invalid ? { isInvalid: true, messages: ['Enter a valid hearing date'] } : null;
  }
}
