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
  cancelButtonCallback?(): void;
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
  minSelectedError?: string;
  maxSelectedError?: string;
  displayMaxSelectedError?: boolean;
  displayMinSelectedError?: boolean;
  emailError?: string;
  lineBreakBefore?: boolean;
  showCondition?: string;
  enableCondition?: string;
  enableAddLocationButton?: boolean;
  enableAddTaskNameButton?: boolean;
  enableAddButton?: boolean;
  changeResetFields?: string[];
  findPersonField?: string;
  findLocationField?: string;
  findTaskNameField?: string;
  domainField?: string;
  disable?: boolean;
  disabledText?: string;
  type: FilterFieldType;
  domain?: PersonRole;
  title?: string;
  titleClasses?: string;
  titleHint?: string;
  subTitle?: string;
  locationTitle?: string;
  radioSelectionChange?: string;
  bookingCheckType?: BookingCheckType;
  placeholderContent?: string;
  maxWidth480px?: boolean;
  maxRows?: number;
  groupOptions?: GroupOptions[];
  maxlength?: number;
  defaultOption?: FilterConfigOption;
}

export interface GroupOptions {
  group: string;
  options: FilterFieldOption[];
  placeholderContent?: string;
}

export interface FilterSetting {
  id: string;
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
