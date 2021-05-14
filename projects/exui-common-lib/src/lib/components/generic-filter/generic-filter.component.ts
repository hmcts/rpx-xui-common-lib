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

  constructor(private readonly filterService: FilterService) {
  }

  public ngOnInit(): void {
    if (!this.settings) {
      this.getSettings();
    }
    if (this.settings && this.settings.fields) {
      this.selected = this.settings.fields;
    }
  }

  public applyFilter(): void {
    this.filterService.persist(this.settings, this.config.persistence);
  }

  public cancelFilter(): void {
    this.getSettings();
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
    this.settings = {
      id: this.config.id,
      fields: this.selected
    };
  }

  private getSettings(): void {
    this.settings = this.filterService.get(this.config.id);
  }
}
