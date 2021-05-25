export type FilterFieldType = 'checkbox' | 'radio' | 'select';

export type FilterPersistence = 'local' | 'session' | 'memory';

export interface FilterConfig {
  id: string;
  fields: FilterFieldConfig[];
  persistence: FilterPersistence;
  applyButtonText: string;
  cancelButtonText: string;
}

export interface FilterFieldConfig {
  name: string;
  options: { key: string, label: string }[];
  minSelected: number;
  maxSelected: number;
  minSelectedError?: string;
  maxSelectedError?: string;
  displayMaxSelectedError?: boolean;
  displayMinSelectedError?: boolean;
  type: FilterFieldType;
  title?: string;
  subTitle?: string;
}

export interface FilterSetting {
  id: string;
  fields: { name: string, value: string[] }[];
}

export class RadioFilterFieldConfig implements FilterFieldConfig {
  public name: string;
  public options: { key: string, label: string}[];
  public minSelected: 1;
  public maxSelected: 1;
  public type: 'radio';
}
