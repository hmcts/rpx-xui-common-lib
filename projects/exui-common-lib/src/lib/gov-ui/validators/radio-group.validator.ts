import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

export function radioGroupValidator(): ValidatorFn {
  return function validate(formGroup: UntypedFormGroup) {
    if (formGroup.controls) {
      for (const control in formGroup.controls) {
        if (!formGroup.controls[control].valid) {
          return {
            isRadioGroupInvalid: true,
          };
        }
      }
    }


    return null;
  };
}
