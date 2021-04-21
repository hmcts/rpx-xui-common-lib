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

  constructor(private readonly filterService: FilterService) { }

  ngOnInit() {
    if (!this.settings) {
      this.getSettings();
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
      return this.settings.fields.some(x=> x.name == id) && this.settings.fields.some(x => x.value.some(x => x == key));
    }
    return false;
  }

  private getSettings() {
    this.settings = this.filterService.get(this.config.id);
  }
}
