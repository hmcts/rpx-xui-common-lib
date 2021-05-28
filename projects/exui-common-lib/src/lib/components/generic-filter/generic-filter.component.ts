import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {FilterConfig, FilterSetting} from '../../models';
import {FilterService} from './../../services/filter/filter.service';

@Component({
  selector: 'xuilib-generic-filter',
  templateUrl: 'generic-filter.component.html',
  styleUrls: ['generic-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GenericFilterComponent {
  private selected: { name: string, value: string[] }[] = [];

  constructor(private readonly filterService: FilterService) {
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

  public applyFilter(): void {
    if (!this.checkFieldsConstraints(this.selected)) {
      this.filterService.persist(this.settings, this.config.persistence);
    }
  }

  public cancelFilter(): void {
    this._settings.fields = JSON.parse(JSON.stringify(this.config.cancelSetting.fields));
    this.selected = JSON.parse(JSON.stringify(this.config.cancelSetting.fields));
  }

  public isSelected(id: string, key: string): boolean {
    if (this.settings) {
      return this.settings.fields.some(x => x.name === id) && this.settings.fields.some(x => x.value.some(v => v === key));
    }
    return false;
  }

  public onSelectionChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fieldName = input.getAttribute('field');
    const match = this.selected.find(x => x.name === fieldName);
    if (match) {
      if (input.type === 'checkbox') {
        if (input.checked) {
          match.value.push(input.value);
        } else {
          const index: number = match.value.indexOf(input.value);
          if (index !== -1) {
            match.value.splice(index, 1);
          }
        }
      } else {
        match.value = [input.value];
      }
    } else {
      this.selected.push({name: fieldName, value: [input.value]});
    }
    this._settings = {
      id: this.config.id,
      fields: this.selected
    };
  }

  private mergeDefaultFields(filter: FilterSetting): void {
    const fields = this.filterService.get(this.config.id) ? this.filterService.get(this.config.id).fields : filter.fields;
    this.selected = fields;
    filter.fields = fields;
  }

  private getSettings(): void {
    this._settings = this.filterService.get(this.config.id);
  }

  private checkFieldsConstraints(selected: { name: string, value: string[] }[]): boolean {
    let hasErrors = false;
    for (const fieldConstraint of this.config.fields) {
      if (fieldConstraint.minSelected > 0 || fieldConstraint.maxSelected > 0) {
        const field = selected.find((f) => f.name === fieldConstraint.name);
        if (!field) {
          // display error for minimum selected
          fieldConstraint.displayMinSelectedError = true;
          hasErrors = true;
          continue;
        }

        if (field.value.length > fieldConstraint.maxSelected) {
          // display error for maximum selected
          fieldConstraint.displayMaxSelectedError = true;
          hasErrors = true;
          continue;
        }

        if (field.value.length < fieldConstraint.minSelected) {
          // display error for minimum selected
          fieldConstraint.displayMinSelectedError = true;
          hasErrors = true;
          continue;
        }
        fieldConstraint.displayMinSelectedError = false;
        fieldConstraint.displayMaxSelectedError = false;
      }
    }
    return hasErrors;
  }
}
