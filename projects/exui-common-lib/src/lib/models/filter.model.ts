import { FormGroup } from '@angular/forms';
import { BookingCheckType } from './location.model';
import { PersonRole } from './person.model';

export type FilterFieldType = 'group-title' | 'checkbox' | 'radio' | 'select' | 'find-person' | 'find-location' | 'checkbox-large' | 'find-service' | 'text-input' | 'email-input' | 'group-select' | 'nested-checkbox' | 'find-task-name';

export type FilterPersistence = 'local' | 'session' | 'memory';

export interface FilterConfigOption {
  key: string;
  label: string;
  selectAll?: boolean;
}

export interface FilterConfig {
  id: string;
  fields: FilterFieldConfig[];
  persistence: FilterPersistence;
  applyButtonText: string;
  enableDisabledButton?: boolean;
  cancelButtonText: string;
  cancelSetting?: FilterSetting;
  showCancelFilterButton?: boolean;
  submitOnCancel?: boolean;
  preSelectedNestedCheckbox?: number[];
  cancelButtonCallback?(): void;
  applyButtonCallback?(): void;
  copyFields?(form: FormGroup): FormGroup;
}

export interface FilterFieldOption {
  key: string;
  label: string;
  selectAll?: true;
}

export interface FilterFieldConfig {
  name: string;
  options: FilterConfigOption[];
  minSelected: number;
  maxSelected: number;
  type: FilterFieldType;
  minSelectedError?: string;
  maxSelectedError?: string;
  displayMaxSelectedError?: boolean;
  displayMinSelectedError?: boolean;
  emailError?: string;
  lineBreakBefore?: boolean;
  showCondition?: string;
  enableCondition?: string;
  enableAddButton?: boolean;
  enableAddLocationButton?: boolean;
  enableAddTaskNameButton?: boolean;
  changeResetFields?: string[];
  findPersonField?: string;
  findLocationField?: string;
  findTaskNameField?: string;
  domainField?: string;
  disable?: boolean;
  disabledText?: string;
  domain?: PersonRole;
  title?: string;
  titleClasses?: string;
  titleHint?: string;
  subTitle?: string;
  locationTitle?: string;
  hintText?: string;
  radioSelectionChange?: string;
  bookingCheckType?: BookingCheckType;
  placeholderContent?: string;
  maxWidth480px?: boolean;
  maxRows?: number;
  groupOptions?: GroupOptions[];
  maxlength?: number;
  defaultOption?: FilterConfigOption;
  readonly?: boolean;
  servicesField?: string;
  services?: string[];
  propertyNameFilter?: string;
}

export interface GroupOptions {
  group: string;
  options: FilterFieldOption[];
  placeholderContent?: string;
}

export interface FilterSetting {
  id: string;
  idamId?: string;
  reset?: boolean;
  fields: { name: string, value: any[] }[];
}

export class RadioFilterFieldConfig implements FilterFieldConfig {
  public name: string;
  public options: { key: string, label: string}[];
  public minSelected: 1;
  public maxSelected: 1;
  public type: 'radio';
}

export interface FilterError {
  name: string;
  error: string;
}
