import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minSelectedValidator<T>(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = control.value as T[] | string;
    return values.length && values.length >= min ? null : {minlength: true};
  };
}

export function maxSelectedValidator<T>(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = control.value as T[] | string;
    return values.length && values.length <= max ? null : {maxLength: true};
  };
}

export function getValues(options: { key: string, label: string, selectAll?: true }[], values: any[]): any[] {
  return options.reduce((acc: string[], option: { key: string, label: string }, index: number) => {
    if (values[index]) {
      return [...acc, option.key];
    }
    return acc;
  }, []);
}

