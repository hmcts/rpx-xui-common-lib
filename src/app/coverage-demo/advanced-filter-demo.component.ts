import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterConfig, FilterPersistence, FilterService } from 'projects/exui-common-lib/src/public-api';
import { advancedFilterDefaults, advancedFilterFields } from './advanced-filter-demo.data';

@Component({
  selector: 'app-advanced-filter-demo',
  templateUrl: './advanced-filter-demo.component.html',
  standalone: false
})
export class AdvancedFilterDemoComponent {
  public readonly config: FilterConfig;
  public readonly settings$;
  public readonly errors$;

  constructor(route: ActivatedRoute, filterService: FilterService) {
    const contract = route.snapshot.queryParamMap.get('contract') || 'conditional';
    const configuredTextDefaults = contract === 'text' && route.snapshot.queryParamMap.get('defaults') === 'configured';
    let id = `commonlib-advanced-${contract}`;
    let persistence: FilterPersistence = route.snapshot.queryParamMap.get('persistence') === 'memory' ? 'memory' : 'session';

    if (contract === 'persistence') {
      const key = route.snapshot.queryParamMap.get('key') === 'alternate' ? 'alternate' : 'primary';
      id = `commonlib-advanced-persistence-${key}`;
      persistence = 'local';
    }

    this.config = {
      id,
      fields: advancedFilterFields(contract),
      persistence,
      applyButtonText: 'Apply advanced filters',
      cancelButtonText: contract === 'choices' || configuredTextDefaults ? 'Restore defaults' : 'Cancel',
      showCancelFilterButton: contract === 'choices' || configuredTextDefaults,
      cancelSetting: advancedFilterDefaults(contract, id, configuredTextDefaults)
    };
    this.settings$ = filterService.getStream(id);
    this.errors$ = filterService.givenErrors;
  }
}
