import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  checkboxesBeCheckedValidator,
  dateValidator,
  radioGroupValidator
} from 'projects/exui-common-lib/src/public-api';

@Component({
  selector: 'app-validator-contracts-demo',
  templateUrl: './validator-contracts-demo.component.html',
  standalone: false
})
export class ValidatorContractsDemoComponent {
  public readonly dateForm = new FormGroup({
    day: new FormControl(''),
    month: new FormControl(''),
    year: new FormControl('')
  }, { validators: dateValidator() });

  public readonly radioForm = new FormGroup({
    first: new FormControl(false, Validators.requiredTrue),
    second: new FormControl(false, Validators.requiredTrue)
  }, { validators: radioGroupValidator() });

  public readonly checkboxForm = new FormGroup({
    civil: new FormControl(false),
    family: new FormControl(false)
  }, { validators: checkboxesBeCheckedValidator() });

  public setValidDate(): void {
    this.dateForm.setValue({ day: '1', month: '1', year: '2026' });
  }

  public clearDate(): void {
    this.dateForm.reset();
  }

  public selectBothRadios(): void {
    this.radioForm.setValue({ first: true, second: true });
  }

  public clearRadios(): void {
    this.radioForm.reset({ first: false, second: false });
  }

  public checkCivil(): void {
    this.checkboxForm.patchValue({ civil: true });
  }

  public clearCheckboxes(): void {
    this.checkboxForm.reset({ civil: false, family: false });
  }
}
