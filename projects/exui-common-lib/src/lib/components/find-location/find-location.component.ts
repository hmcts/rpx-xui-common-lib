import {Component, Input, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FilterFieldConfig} from '../../models';
import {LocationByEPIMSModel} from '../../models/location.model';
import {getValues} from '../generic-filter/generic-filter-utils';
import {SearchLocationComponent} from '../search-location/search-location.component';

@Component({
  selector: 'xuilib-find-location',
  templateUrl: './find-location.component.html',
  styleUrls: ['./find-location.component.scss']
})
export class FindLocationComponent {
  @Input() public selectedLocations: LocationByEPIMSModel[] = [];
  @Input() public submitted: boolean = true;
  @Input() public enableAddLocationButton: boolean = true;
  @Input() public form: FormGroup;
  @Input() public field: FilterFieldConfig;
  @Input() public fields: FilterFieldConfig[];
  @Input() public title = 'Search for a location by name';
  public locations: LocationByEPIMSModel[] = [];
  public tempSelectedLocation: LocationByEPIMSModel = null;
  public serviceIds: string = 'SSCS,IA';
  @ViewChild(SearchLocationComponent) public searchLocationComponent: SearchLocationComponent;
  private pServices: string[] = [];
  private pDisabled: boolean = false;

  public get disabled(): boolean {
    return this.pDisabled;
  }

  @Input()
  public set disabled(value: boolean) {
    if (value) {
      this.searchLocationComponent.resetSearchTerm();
      this.removeSelectedValues();
    }
    this.pDisabled = value;
  }

  public get services(): string[] {
    return this.pServices;
  }

  @Input()
  public set services(value: string[]) {
    this.pServices = value;
    const field = this.fields.find(f => f.name === this.field.findLocationField);
    if (field) {
      if (typeof value === 'string') {
        this.serviceIds = value;
      } else {
        this.serviceIds = getValues(field.options, value).filter(x => x !== 'services_all').join(',');
      }
    }
  }

  public addLocation(): void {
    if (this.tempSelectedLocation) {
      this.selectedLocations = [...this.selectedLocations, this.tempSelectedLocation];
      this.addSelectedLocationsToForm([this.tempSelectedLocation]);
      this.tempSelectedLocation = null;
      this.locations = [];
      this.searchLocationComponent.resetSearchTerm();
    }
  }

  public removeLocation(location: LocationByEPIMSModel): void {
    if (location.epims_id) {
      this.selectedLocations = this.selectedLocations.filter(selectedLocation => selectedLocation.epims_id !== location.epims_id);
      const formArray = this.form.get(this.field.name) as FormArray;
      const index = (formArray.value as LocationByEPIMSModel[]).findIndex(selectedLocation => selectedLocation.epims_id === location.epims_id);
      if (index > -1) {
        formArray.removeAt(index);
      }
    }
  }

  public onInputChanged(term: string): void {
    // if the filter is in single mode clear the selected locations
    if (typeof term === 'string' && this.field.maxSelected === 1) {
        this.removeSelectedValues();
    }
  }

  public onLocationSelected(location: LocationByEPIMSModel): void {
    if (this.field.maxSelected === 1) {
      this.removeSelectedValues();
      this.addSelectedLocationsToForm([location]);
    } else {
      if (!this.selectedLocations.find(x => x.epims_id === location.epims_id)) {
        if (location.epims_id) {
          this.tempSelectedLocation = location;
        }
      }
    }
  }

  private removeSelectedValues(): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    for (let i = 0; i < formArray.length; i++) {
      formArray.removeAt(i);
    }
    this.selectedLocations = [];
  }

  private addSelectedLocationsToForm(locations: LocationByEPIMSModel[]): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    for (const location of locations) {
      formArray.push(new FormControl(location));
    }
  }
}
