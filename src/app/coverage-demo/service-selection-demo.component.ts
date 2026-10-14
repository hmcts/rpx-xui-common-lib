import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilterFieldConfig } from 'projects/exui-common-lib/src/public-api';
import { serviceOptions } from './service-selection-demo.data';

@Component({
  selector: 'app-service-selection-demo',
  templateUrl: './service-selection-demo.component.html',
  standalone: false
})
export class ServiceSelectionDemoComponent {
  public readonly form = new FormGroup({ services: new FormArray([]) });
  public readonly field: FilterFieldConfig;
  public disabled: boolean | null;
  public changes = 0;

  constructor(route: ActivatedRoute) {
    const single = route.snapshot.queryParamMap.get('mode') === 'single';
    this.field = {
      name: 'services', type: 'find-service', minSelected: 0, maxSelected: single ? 1 : 10,
      enableAddButton: !single, options: serviceOptions.map((option) => ({ ...option }))
    };
    // GenericFilter supplies null for enabled; the explicit false variant exposes the public boolean contract.
    this.disabled = route.snapshot.queryParamMap.get('disabled') === 'false' ? false : null;
  }
}
