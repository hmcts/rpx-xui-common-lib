import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterConfig, FilterFieldConfig, FilterPersistence, FilterService } from 'projects/exui-common-lib/src/public-api';

@Component({
  selector: 'app-advanced-filter-demo',
  templateUrl: './advanced-filter-demo.component.html',
  standalone: false
})
export class AdvancedFilterDemoComponent {
  public readonly config: FilterConfig;
  public readonly settings$;

  constructor(route: ActivatedRoute, filterService: FilterService) {
    const contract = route.snapshot.queryParamMap.get('contract');
    let fields: FilterFieldConfig[];
    let id: string;
    let persistence: FilterPersistence = 'session';

    if (contract === 'persistence') {
      const key = route.snapshot.queryParamMap.get('key') === 'alternate' ? 'alternate' : 'primary';
      id = `commonlib-advanced-persistence-${key}`;
      persistence = 'local';
      fields = [{
        name: 'categories', title: 'Categories', type: 'checkbox', minSelected: 0, maxSelected: 0,
        options: [{ key: 'family', label: 'Family category' }]
      }];
    } else {
      id = 'commonlib-advanced-conditional';
      fields = [
        {
          name: 'include', title: 'Include details', type: 'radio', minSelected: 0, maxSelected: 0,
          options: [{ key: 'no', label: 'No detail' }, { key: 'yes', label: 'Include detail' }]
        },
        {
          name: 'detail', title: 'Detail', type: 'text-input', minSelected: 0, maxSelected: 0, options: [],
          showCondition: 'include=yes', minSelectedError: 'Enter a detail', displayMinSelectedError: true
        }
      ];
    }

    this.config = {
      id,
      fields,
      persistence,
      applyButtonText: 'Apply advanced filters',
      cancelButtonText: 'Cancel',
      cancelSetting: {
        id,
        fields: contract !== 'persistence'
          ? [{ name: 'include', value: ['no'] }, { name: 'detail', value: [''] }]
          : []
      }
    };
    this.settings$ = filterService.getStream(id);
  }
}
