import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterConfig, FilterConfigOption, FilterError, FilterFieldConfig, FilterSetting, GroupOptions } from '../../models';
import { FilterService } from './../../services/filter/filter.service';
import { getValues, maxSelectedValidator, minSelectedValidator } from './generic-filter-utils';

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
  public filteredSkillsByServices: GroupOptions[];
  public filteredSkillsByServicesCheckbox: FilterConfigOption[];
  public previousSelectedNestedCheckbox: string[] = [];

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
    if (field && field.minSelected > 0) {
      validators.push(minSelectedValidator(field.minSelected));
    }

    if (field && field.maxSelected > 0) {
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
    this.filterSkillsByServices(null, this.config);
    const services = this.config.fields.find(field => field.name === 'user-services');
    if (services) {
      this.startFilterSkillsByServices(this.form, services);
    }
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
    // find-location is special case where need to reset textbox (by existing disabling functionality)
    // field.disable referred to component itself
    if (field.type === 'find-location') {
      return true;
    }
    // Note: field.disable decides whether to actually disable or not
    return field.disable ? field.disable : null;
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

  // when user enters input change radio button
  public inputChanged(field: FilterFieldConfig): void {
    if (field.name === 'user-services') {
      const selectedServices = this.getSelectedValuesForFields(this.form.controls, field);
      this.filterSkillsByServices(selectedServices, this.config);
    }
    if (field.radioSelectionChange && typeof field.radioSelectionChange === 'string') {
      const [name, value] = field.enableCondition.split('=');
      this.form.get(name).patchValue(value);
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

    if (this.config.cancelButtonCallback) {
      this.config.cancelButtonCallback();
    }
  }

  public updatePersonControls(values: any, field: FilterFieldConfig): void {
    let keys;
    if (!values) {
      keys = Object.keys(this.form.get(field.name).value);
    } else {
      keys = Object.keys(values);
    }
    for (const key of keys) {
      if (this.form.get(field.name) && this.form.get(field.name).get(key)) {
        const value = values && values[key] ? values[key] : null;
        this.form.get(field.name).get(key).patchValue(value);
      }
    }
  }

  public checkBoxChecked(field: any, i: number) {
    return (this.form.get(field.name) as FormArray)['controls'][i]['value'];
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
    } else {
      formArray.controls.forEach((control: AbstractControl) => {
        if (isChecked) {
          control.patchValue(true);
        } else {
          control.patchValue(false);
        }
      });
    }
    if (field.changeResetFields && field.changeResetFields.length) {
      for (const resetField of field.changeResetFields) {
        this.resetField(resetField, form);
      }
    }
    if (field.name === 'user-services') {
      this.startFilterSkillsByServices(form, field);
    } else if (field.name === 'user-skills') {
      if (isChecked) {
        const selectedIndex = field.options.findIndex(option => option.key === event.target.value);
        const selectedCheckbox = this.form.get('user-skills').value;
        selectedCheckbox[selectedIndex] = true;
        this.form.get('user-skills').setValue(selectedCheckbox);
        this.previousSelectedNestedCheckbox.push(event.target.value);
      } else {
        const index = this.previousSelectedNestedCheckbox.indexOf(event.target.value);
        if (index !== -1) {
          this.previousSelectedNestedCheckbox.splice(index, 1);
        }
      }
    }
  }

  private startFilterSkillsByServices(form: FormGroup, field: FilterFieldConfig) {
    const servicesArray: string[] = [];
    form.value[field.name].map((service: boolean, index: number) => {
      if (service) {
        servicesArray.push(field.options[index].key);
      }
    });
    this.filterSkillsByServices(servicesArray, this.config);
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
      if (field.type === 'checkbox' || field.type === 'checkbox-large' || field.type === 'nested-checkbox') {
        const formArray = this.buildCheckBoxFormArray(field, settings);
        this.form.addControl(field.name, formArray);
      } else if (field.type === 'find-location' || field.type === 'find-service') {
        const formArray = this.buildFormArray(field, settings);
        this.form.addControl(field.name, formArray);
      } else {
        const validators: ValidatorFn[] = [];
        if (field.minSelected && field.minSelected > 0) {
          validators.push(Validators.required);

          if (field.type === 'text-input') {
            validators.push(Validators.minLength(field.minSelected));
          }

          if (field.type === 'email-input') {
            validators.push(Validators.email);
          }
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
        } else if (field.type !== 'group-title') {
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

  private buildFormArray(field: FilterFieldConfig, settings: FilterSetting): FormArray {
    const validators = GenericFilterComponent.addFormValidators(field);
    const formArray = this.fb.array([], validators);
    let defaultValues: { name: string; value: any[] };
    if (settings && settings.fields) {
      defaultValues = settings.fields.find((f) => f.name === field.name);
      if (defaultValues && defaultValues.value && defaultValues.value.length > 0) {
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
    let errors: FilterError[] = [];
    for (const field of this.config.fields) {
      const formGroup = form.get(field.name);
      if (formGroup && formGroup.errors && (formGroup.errors.minlength || formGroup.errors.required)) {
        errors.push({name: field.name, error: field.minSelectedError});
      }
      if (formGroup && formGroup.errors && formGroup.errors.maxlength) {
        errors.push({name: field.name, error: field.maxSelectedError});
      }
    }

    // remove duplicates
    errors = errors.filter( (filterError, i, arr) => {
      return errors.indexOf(arr.find(item => item.name === filterError.name)) === i;
    });

    if (errors.length) {
      this.filterService.givenErrors.next(errors);
    }
  }

  public filterSkillsByServices(services: string[], config: FilterConfig) {
    this.filteredSkillsByServices = [];
    this.filteredSkillsByServicesCheckbox = [];
    const userSkillsSelectField = config.fields.find(f => f.name === 'user-skills' && f.type === 'group-select');
    const userSkillsCheckboxField = config.fields.find(f => f.name === 'user-skills' && f.type === 'nested-checkbox');

    if (userSkillsSelectField) {
      const userSkills = userSkillsSelectField.groupOptions;
      if (!services || services.length === 0) {
        this.filteredSkillsByServices = userSkills;
      } else {
        services.forEach(s => {
          const groupOption = userSkills.find(u => u.group.toLowerCase() === s.toLowerCase());
          if (groupOption) {
            this.filteredSkillsByServices.push(groupOption);
          }
        });
      }
    } else if (userSkillsCheckboxField) {
      const userSkills = userSkillsCheckboxField.groupOptions;
      if (!services || services.length === 0) {
        this.filteredSkillsByServices = userSkills;
      } else {
        services.forEach(s => {
          const groupOption = userSkills.find(u => u.group.toLowerCase() === s.toLowerCase());
          if (groupOption) {
            this.filteredSkillsByServices.push(groupOption);
          }
        });
        this.filteredSkillsByServicesCheckbox = this.filteredSkillsByServices.map(skill => {
          return skill.options;
        }).reduce((a, b) => {
          return a.concat(b);
        }, []);
        userSkillsCheckboxField.options = [];
        userSkillsCheckboxField.options = this.filteredSkillsByServicesCheckbox;

        (this.form.get('user-skills') as FormArray)['controls'] = this.filteredSkillsByServicesCheckbox.map(() => new FormControl());
        this.form.get('user-skills').setValue(this.filteredSkillsByServicesCheckbox.map(skill => {
          return this.previousSelectedNestedCheckbox.includes(skill.key);
        }));

        return this.filteredSkillsByServicesCheckbox;
      }
    }
    this.filteredSkillsByServices = this.sortGroupOptions(this.filteredSkillsByServices);
    return this.filteredSkillsByServices;
  }

  private getSelectedValuesForFields(formValues: any, field: FilterFieldConfig): string[] {
    const selectedValues: string[] = [];
    Object.keys(formValues).map((name: string) => {
      const values = formValues[name].value;
      if (name === field.name) {
        values.forEach((v: any) => {
          selectedValues.push(v.key);
        });
      }
    });
    return selectedValues;
  }

  private sortGroupOptions(groupOptions: GroupOptions[]): GroupOptions[] {
    const sortedResults: GroupOptions[] = [];
    const groups = groupOptions.map(go => go.group);
    groups.sort().forEach(g => {
      const options = groupOptions.find((go: any) => go.group === g).options;
      const sortedOptions = options.sort((a, b) => {
        return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : (b.label.toLowerCase() > a.label.toLowerCase() ? -1 : 0);
      });
      const result = {
        group : g,
        options: sortedOptions
      };
      sortedResults.push(result);
    });
    return sortedResults;
  }
}
