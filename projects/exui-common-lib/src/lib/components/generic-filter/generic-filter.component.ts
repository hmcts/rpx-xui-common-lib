import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FilterConfig, FilterFieldConfig, FilterSetting} from '../../models';
import {FilterService} from './../../services/filter/filter.service';
import {maxSelectedValidator, minSelectedValidator} from './generic-filter-utils';

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
      this.filterService.persist(this.settings, this.config.persistence);
    } else {
      this.emitFormErrors(form);
    }
  }

  // when domain changes ensure that person field is reset
  public updateSpecificPerson(field: FilterFieldConfig, form: FormGroup): void {
    if (field.findPersonField) {
      this.config.fields.find((f) => f.name === field.findPersonField).domain = form.get(field.name).value;
      if (this.form.get(field.findPersonField)) {
        this.form.get(field.findPersonField).setValue(null);
      }
    }
  }

  public cancelFilter(): void {
    this.buildForm(this.config, this.settings, true);
    if (this.config && this.config.cancelSetting) {
      this._settings.fields = JSON.parse(JSON.stringify(this.config.cancelSetting.fields));
    }
    this.filterService.persist(this.settings, this.config.persistence);
  }

  public updatePersonControls(values: any, field: FilterFieldConfig): void {
    const keys = Object.keys(values);
    for (const key of keys) {
      if (this.form.get(field.name) && this.form.get(field.name).get(key)) {
        this.form.get(field.name).get(key).patchValue(values[key]);
      }
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
      if (field.type === 'checkbox') {
        const formArray = this.buildCheckBoxFormArray(field, settings);
        this.form.addControl(field.name, formArray);
      } else {
        const validators: ValidatorFn[] = [];
        if (field.minSelected && field.minSelected > 0) {
          validators.push(Validators.required);
        }
        let defaultValue: string = '';
        if (reset && config.cancelSetting) {
          const cancelField = config.cancelSetting.fields.find((f) => f.name === field.name);
          defaultValue = cancelField ? cancelField.value[0] : '';
        } else if (settings && settings.fields) {
          const lastSavedValue = settings.fields.find((f) => f.name === field.name);
          defaultValue = lastSavedValue ? lastSavedValue.value[0] as unknown as string : '';
        }
        // if field is find-person build a form group;
        if (field.type === 'find-person') {
          const formGroup = new FormGroup({
            domain: new FormControl(''),
            email: new FormControl(defaultValue.hasOwnProperty('email') ? (defaultValue as any).email : '', validators),
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
          this.updateSpecificPerson(field, this.form);
        }
      }
    }
  }

  private buildCheckBoxFormArray(field: FilterFieldConfig, settings: FilterSetting): FormArray {
    const formArray = this.fb.array([], [
      minSelectedValidator(field.minSelected),
      maxSelectedValidator(field.maxSelected)
    ]);
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

  private getSelectedValues(formValues: any, config: FilterConfig): any {
    return Object.keys(formValues).map((name: string) => {
      const values = formValues[name];
      if (Array.isArray(values)) {
        const field = config.fields.find(f => f.name === name);
        const realValues = field.options.reduce((acc: string[], option: { key: string, label: string }, index: number) => {
          if (values[index]) {
            return [...acc, option.key];
          }
          return acc;
        }, []);
        return {value: realValues, name};
      } else {
        return {value: [values], name};
      }
    });
  }

  private emitFormErrors(form: FormGroup): void {
    for (const field of this.config.fields) {
      const formGroup = form.get(field.name);
      if (formGroup && formGroup.errors && formGroup.errors.minLength) {
        this.filterService.givenErrors.next(field.minSelectedError);
      }
      if (formGroup && formGroup.errors && formGroup.errors.maxLength) {
        this.filterService.givenErrors.next(field.maxSelectedError);
      }
    }
  }
}
