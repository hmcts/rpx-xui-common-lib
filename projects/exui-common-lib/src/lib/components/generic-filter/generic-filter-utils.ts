import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function minSelectedValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = control.value as string[];
    return values.length && values.filter(value => value).length >= min ? null : {minLength: true};
  };
}

export function maxSelectedValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = control.value as string[];
    return values.length && values.filter(value => value).length <= max ? null : {maxLength: true};
  };
}

