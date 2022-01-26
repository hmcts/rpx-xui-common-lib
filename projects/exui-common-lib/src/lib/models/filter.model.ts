import {PersonRole} from './person.model';

export type FilterFieldType = 'checkbox' | 'radio' | 'select' | 'find-person' | 'find-location' | 'checkbox-large';

export type FilterPersistence = 'local' | 'session' | 'memory';

export interface FilterConfig {
  id: string;
  fields: FilterFieldConfig[];
  persistence: FilterPersistence;
  applyButtonText: string;
  cancelButtonText: string;
  cancelSetting?: FilterSetting;
  enableDisabledButton?: boolean;
}

export interface FilterFieldConfig {
  name: string;
  options: { key: string, label: string, selectAll?: true }[];
  minSelected: number;
  maxSelected: number;
  minSelectedError?: string;
  maxSelectedError?: string;
  displayMaxSelectedError?: boolean;
  displayMinSelectedError?: boolean;
  lineBreakBefore?: boolean;
  showCondition?: string;
  enableCondition?: string;
  enableAddLocationButton?: boolean;
  findPersonField?: string;
  findLocationField?: string;
  domainField?: string;
  disabledText?: string;
  type: FilterFieldType;
  domain?: PersonRole;
  title?: string;
  subTitle?: string;
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
