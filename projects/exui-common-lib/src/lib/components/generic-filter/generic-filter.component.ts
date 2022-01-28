import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FilterConfig, FilterError, FilterFieldConfig, FilterSetting} from '../../models';
import {FilterService} from './../../services/filter/filter.service';
import {getValues, maxSelectedValidator, minSelectedValidator} from './generic-filter-utils';

@Component({
  selector: 'xuilib-generic-filter',
  templateUrl: 'generic-filter.component.html',
  styleUrls: ['generic-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GenericFilterComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public submitted = false;
  public formSub: Subscription;

  constructor(private readonly filterService: FilterService, private readonly fb: FormBuilder) {
  }

  // tslint:disable-next-line:variable-name
  private _config: FilterConfig;

  public get config(): FilterConfig {
    return this._config;
  }

  @Input()
  public set config(value: FilterConfig) {
    this._config = {
      ...value,
      fields: value.fields.map(field => ({
        ...field,
        displayMinSelectedError: false,
        displayMaxSelectedError: false,
      }))
    };
    this._config = value;
  }

  // tslint:disable-next-line:variable-name
  private _settings?: FilterSetting;

  public get settings(): FilterSetting {
    return this._settings;
  }

  @Input()
  public set settings(value: FilterSetting) {
    if (!value) {
      this.getSettings();
    }
    if (value && value.fields) {
      this.mergeDefaultFields(value);
    }
    this._settings = value;
  }

  private static addFormValidators(field: FilterFieldConfig): Validators {
    const validators = [];
    if (field && field.minSelected) {
      validators.push(minSelectedValidator(field.minSelected));
    }

    if (field && field.maxSelected) {
      validators.push(maxSelectedValidator(field.maxSelected));
    }
    return validators;
  }

  public ngOnInit(): void {
    if (!this.settings) {
      this.getSettings();
    }
    this.mergeDefaultFields(this.settings);
    this.buildForm(this.config, this.settings);
    this.formSub = this.form.valueChanges.subscribe(() => this.submitted = false);
  }

  public ngOnDestroy(): void {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  public hidden(field: FilterFieldConfig, form: FormGroup): boolean {
    if (!field.showCondition) {
      return false;
    }
    if (typeof field.showCondition === 'string') {
      const control = form.get(field.name) as FormControl;
      const [name, value] = field.showCondition.split('=');
      if (form.value && form.value[name] === value) {
        if (field.type === 'find-person') {
          control.get('email').setValidators(Validators.required);
          control.get('email').updateValueAndValidity();
        } else {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
        return false;
      } else {
        if (field.type === 'find-person') {
          control.get('email').clearValidators();
          control.get('email').updateValueAndValidity();
        } else {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      }
    }
    return true;
  }

  public disabled(field: FilterFieldConfig, form: FormGroup): boolean {
    if (!field.enableCondition) {
      return null;
    }
    if (typeof field.enableCondition === 'string') {
      const control = form.get(field.name) as FormControl;
      const [name, value] = field.enableCondition.split('=');
      if (form.value && form.value[name] === value) {
        if (field.type === 'find-person') {
          control.get('email').setValidators(Validators.required);
          control.get('email').updateValueAndValidity();
        } else {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
        return null;
      } else {
        if (field.type === 'find-person') {
          control.get('email').clearValidators();
          control.get('email').updateValueAndValidity();
        } else {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      }
    }
    return true;
  }

  public applyFilter(form: FormGroup): void {
    this.submitted = true;
    form.markAsTouched();
    if (form.valid) {
      this._settings = {
        id: this.config.id,
        fields: this.getSelectedValues(form.value, this.config)
      };
      this.filterService.givenErrors.next(null);
      const settings = {...this.settings, reset: false};
      this.filterService.persist(settings, this.config.persistence);
    } else {
      this.emitFormErrors(form);
    }
  }

  // when domain changes ensure that person field is reset
  public fieldChanged(field: FilterFieldConfig, form: FormGroup): void {
    // TODO - Do similar with jurisdiction/service for caseworkers by services
    if (field.changeResetFields && field.changeResetFields.length) {
      for (const resetField of field.changeResetFields) {
        this.resetField(resetField, form);
      }
    }
  }

  public cancelFilter(): void {
    this.buildForm(this.config, this.settings, true);
    if (this.config && this.config.cancelSetting) {
      this._settings.fields = JSON.parse(JSON.stringify(this.config.cancelSetting.fields));
    }
    const settings = {...this.settings, reset: true};
    this.filterService.persist(settings, this.config.persistence);
    this.filterService.givenErrors.next(null);
    this.submitted = false;
  }

  public updatePersonControls(values: any, field: FilterFieldConfig): void {
    const keys = Object.keys(values);
    for (const key of keys) {
      if (this.form.get(field.name) && this.form.get(field.name).get(key)) {
        this.form.get(field.name).get(key).patchValue(values[key]);
      }
    }
  }

  public toggleSelectAll(event: any, form: FormGroup, item: { key: string; label: string; selectAll?: true }, field: FilterFieldConfig): void {
    const isChecked = event.target.checked;
    const formArray: FormArray = form.get(field.name) as FormArray;
    if (!item.selectAll) {
      const allChecked = formArray.controls.every((control: AbstractControl) => control.value);
      let index: number = null;
      const hasSelectAllOption = field.options.find((option, i) => {
        if (option.hasOwnProperty('selectAll')) {
          index = i;
          return true;
        }
        return false;
      });
      // tslint:disable-next-line:variable-name
      const isAllCheckedExcludingTheSelectAllOption = formArray.controls.filter((_control: AbstractControl, i: number) => i !== index)
        .every((control: AbstractControl) => control.value);

      if (!allChecked && hasSelectAllOption && !isChecked) {
        formArray.controls.forEach((control: AbstractControl, i: number) => {
          if (index === i) {
            control.patchValue(false);
            return;
          }
        });
      } else if (hasSelectAllOption && !allChecked && isChecked && isAllCheckedExcludingTheSelectAllOption) {
        formArray.controls[index].patchValue(true);
      }
      return;
    }
    formArray.controls.forEach((control: AbstractControl) => {
      if (isChecked) {
        control.patchValue(true);
      } else {
        control.patchValue(false);
      }
    });
  }


  private resetField(resetField: string, form: FormGroup): void {
    const control = form.get(resetField);
    const defaultValue: { name: string, value: any[] } = this.config.cancelSetting.fields.find((f) => f.name === resetField);
    if (control instanceof FormArray) {
      for (let i = 0; i < control.length; i++) {
        control.removeAt(i);
      }
    } else if (control instanceof FormGroup) {
      const keys = Object.keys(control.value);
      for (const key of keys) {
        this.resetField(key, control);
      }
    } else if (control instanceof FormControl) {
      const value = defaultValue && defaultValue.value && defaultValue.value.length ? defaultValue.value[0] : null;
      control.setValue(value);
    }
  }

  private mergeDefaultFields(filter: FilterSetting): void {
    if (filter) {
      filter.fields = this.filterService.get(this.config.id) ? this.filterService.get(this.config.id).fields : filter.fields;
    } else if (this.config && this.config.cancelSetting) {
      this._settings = {
        id: this.config.id,
        fields: JSON.parse(JSON.stringify(this.config.cancelSetting.fields))
      };
    }
  }

  private getSettings(): void {
    this._settings = this.filterService.get(this.config.id);
  }

  private buildForm(config: FilterConfig, settings: FilterSetting, reset?: boolean): void {
    const findPersonControl = this.form ? this.form.get('findPersonControl') : null;
    this.form = this.fb.group({});
    if (findPersonControl) {
      // in order to maintain find person component, control needs to be kept
      this.form.addControl('findPersonControl', findPersonControl);
    }
    for (const field of config.fields) {
      if (field.type === 'checkbox' || field.type === 'checkbox-large') {
        const formArray = this.buildCheckBoxFormArray(field, settings);
        this.form.addControl(field.name, formArray);
      } else if (field.type === 'find-location') {
        const formArray = this.buildFindLocationFormArray(field, settings);
        this.form.addControl(field.name, formArray);
      } else {
        const validators: ValidatorFn[] = [];
        if (field.minSelected && field.minSelected > 0) {
          validators.push(Validators.required);
        }
        let defaultValue: any = null;
        if (reset && config.cancelSetting) {
          const cancelField = config.cancelSetting.fields.find((f) => f.name === field.name);
          defaultValue = cancelField && cancelField.value ? cancelField.value[0] : '';
        } else if (settings && settings.fields) {
          const lastSavedValue = settings.fields.find((f) => f.name === field.name);
          defaultValue = lastSavedValue && lastSavedValue ? lastSavedValue.value[0] : '';
        }
        // if field is find-person build a form group;
        if (field.type === 'find-person') {
          const formGroup = new FormGroup({
            domain: new FormControl(''),
            email: new FormControl(defaultValue && defaultValue.hasOwnProperty('email') ? defaultValue.email : '', validators),
            id: new FormControl(''),
            name: new FormControl(''),
            knownAs: new FormControl(''),
          });
          this.form.addControl(field.name, formGroup);
        } else {
          const control = new FormControl(defaultValue, validators);
          this.form.addControl(field.name, control);
        }

        // if field updates find person component set the initial domain
        if (field.findPersonField) {
          this.fieldChanged(field, this.form);
        }
      }
    }
  }

  private buildCheckBoxFormArray(field: FilterFieldConfig, settings: FilterSetting): FormArray {
    const validators = GenericFilterComponent.addFormValidators(field);
    const formArray = this.fb.array([], validators);
    let defaultValues;
    if (settings && settings.fields) {
      defaultValues = settings.fields.find((f) => f.name === field.name);
    }
    for (const option of field.options) {
      let checked = false;
      if (defaultValues && Array.isArray(defaultValues.value)) {
        checked = !!defaultValues.value.find((value) => value === option.key);
      }
      formArray.push(new FormControl(checked));
    }
    return formArray;
  }

  private buildFindLocationFormArray(field: FilterFieldConfig, settings: FilterSetting): FormArray {
    const validators = GenericFilterComponent.addFormValidators(field);
    const formArray = this.fb.array([], validators);
    let defaultValues: { name: string; value: any[] };
    if (settings && settings.fields) {
      defaultValues = settings.fields.find((f) => f.name === field.name);
      if (defaultValues) {
        for (const defaultValue of defaultValues.value) {
          formArray.push(new FormControl(defaultValue));
        }
      }
    }
    return formArray;
  }

  private getSelectedValues(formValues: any, config: FilterConfig): any {
    return Object.keys(formValues).map((name: string) => {
      const values = formValues[name];
      if (Array.isArray(values)) {
        const field = config.fields.find(f => f.name === name);
        if (field.type === 'find-location') {
          return {value: values, name};
        } else {
          return {value: getValues(field.options, values), name};
        }
      } else {
        return {value: [values], name};
      }
    });
  }

  private emitFormErrors(form: FormGroup): void {
    const errors: FilterError[] = [];
    for (const field of this.config.fields) {
      const formGroup = form.get(field.name);
      if (formGroup && formGroup.errors && formGroup.errors.minLength) {
        errors.push({name: field.name, error: field.minSelectedError});
      }
      if (formGroup && formGroup.errors && formGroup.errors.maxLength) {
        errors.push({name: field.name, error: field.minSelectedError});
      }
    }
    if (errors.length) {
      this.filterService.givenErrors.next(errors);
    }
  }
}
