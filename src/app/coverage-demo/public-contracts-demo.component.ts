import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FilterConfigOption, LocationByEPIMMSModel } from 'projects/exui-common-lib/src/public-api';

@Component({
  selector: 'app-public-contracts-demo',
  templateUrl: './public-contracts-demo.component.html',
  standalone: false
})
export class PublicContractsDemoComponent {
  public readonly feature: string;
  public readonly services: FilterConfigOption[] = [
    { key: 'IA', label: 'Immigration and Asylum' },
    { key: 'CIVIL', label: 'Civil' }
  ];

  public readonly selectedServices: FilterConfigOption[] = [];
  public readonly labelConfig = {
    id: 'contract-label', label: 'Label contract', name: 'contract-label', isPageHeading: true, classes: '', optional: 'optional'
  };

  public readonly inviteForm = new FormGroup({
    roles: new FormGroup({
      'pui-case-manager': new FormControl(false),
      'pui-user-manager': new FormControl(false),
      'pui-organisation-manager': new FormControl(false)
    })
  });

  public serviceSelection: FilterConfigOption | undefined;
  public locationSelection: LocationByEPIMMSModel | undefined;

  constructor(route: ActivatedRoute) {
    this.feature = route.snapshot.queryParamMap.get('feature') || 'service';
  }

  public selectService(service: FilterConfigOption): void {
    this.serviceSelection = service;
    this.selectedServices.push(service);
  }

  public selectLocation(location: LocationByEPIMMSModel): void {
    this.locationSelection = location;
  }
}
