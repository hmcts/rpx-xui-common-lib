import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  FilterFieldConfig,
  LocationByEPIMMSModel,
  WorkType
} from 'projects/exui-common-lib/src/public-api';
import { createLocationField, createWorkTypeField, selectedVenue } from './lookups-demo.data';

@Component({
  selector: 'app-lookups-demo',
  templateUrl: './lookups-demo.component.html',
  standalone: false
})
export class LookupsDemoComponent {
  public readonly feature: string;
  public readonly singleMode: boolean;
  public readonly locationField: FilterFieldConfig;
  public readonly locationFields: FilterFieldConfig[];
  public readonly locationForm = new FormGroup({ locations: new FormArray<FormControl<LocationByEPIMMSModel>>([]) });
  public readonly workTypeField: FilterFieldConfig;
  public readonly workTypeFields: FilterFieldConfig[];
  public readonly workTypeForm = new FormGroup({ workTypes: new FormArray<FormControl<WorkType>>([]) });
  public readonly taskNameForm = new FormGroup({});
  public readonly venueControl = new FormControl<LocationByEPIMMSModel | null>(null);
  public readonly venueSelectedLocations: LocationByEPIMMSModel[];
  public locationApplied: LocationByEPIMMSModel[] = [];
  public workTypeApplied: WorkType[] = [];
  public taskNameSelection: unknown = null;
  public venueSelection: LocationByEPIMMSModel | undefined;

  constructor(route: ActivatedRoute) {
    const query = route.snapshot.queryParamMap;
    this.feature = query.get('feature') ?? '';
    this.singleMode = query.get('mode') !== 'multi';
    this.locationField = createLocationField(this.singleMode);
    this.locationFields = [this.locationField];
    this.workTypeField = createWorkTypeField(this.singleMode);
    this.workTypeFields = [this.workTypeField];
    this.venueSelectedLocations = query.get('filtered') === 'true' ? [selectedVenue] : [];
  }

  public applyLocations(): void {
    this.locationApplied = [...this.locationForm.controls.locations.value];
  }

  public applyWorkTypes(): void {
    this.workTypeApplied = [...this.workTypeForm.controls.workTypes.value];
  }
}
