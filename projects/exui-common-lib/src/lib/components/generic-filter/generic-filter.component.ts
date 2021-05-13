import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FilterConfig, FilterSetting } from '../../models/filter.model';
import { FilterService } from '../../services/filter/filter.service';

@Component({
  selector: 'xuilib-generic-filter',
  templateUrl: 'generic-filter.component.html',
  styleUrls: ['generic-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GenericFilterComponent implements OnInit {

  @Input() public config: FilterConfig;
  @Input() public settings?: FilterSetting;
  private selected: { name: string, value: string[] }[] = [];

  constructor(private readonly filterService: FilterService) { }

  public ngOnInit() {
    if (!this.settings) {
      this.getSettings();
    }
    if (this.settings && this.settings.fields) {
      this.selected = this.settings.fields;
    }
  }

  public applyFilter() {
    this.filterService.persist(this.settings, this.config.persistence);
  }

  public cancelFilter() {
    this.getSettings();
  }

  public isSelected(id: string, key: string): boolean {
    if (this.settings) {
      return this.settings.fields.some(x => x.name === id) && this.settings.fields.some(x => x.value.some(v => v === key));
    }
    return false;
  }

  public onSelectionChange(item: any) {
    const fieldName = item.target.name.replace(`${item.target.type}_`, '');
    const match = this.selected.find(x => x.name === fieldName);
    if (match) {
      if (item.target.type === 'checkbox') {
        if (item.target.checked) {
          match.value.push(item.target.value);
        } else {
          const index: number = match.value.indexOf(item.target.value);
          if (index !== -1) {
            match.value.splice(index, 1);
          }
        }
      } else {
        match.value = [item.target.value];
      }
    } else {
      this.selected.push({ name: fieldName, value: [item.target.value] });
    }
    this.settings = {
      id: this.config.id,
      fields: this.selected
    };
  }

  private getSettings() {
    this.settings = this.filterService.get(this.config.id);
  }
}
