import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { LocationModel } from '../../models/location.model';
import { LocationService } from '../../services/locations/location.service';

@Component({
  selector: 'exui-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})

export class SearchLocationComponent implements OnInit {
  @Input() public serviceId: string = '';
  @Input() public locationType: string = '';
  @Input() public disabled?: boolean = null;
  @Input() public selectedLocations$: Observable<LocationModel[]>;
  @Input() public submitted?: boolean = true;
  @Input() public findLocationForm: FormGroup;

  public locations$: Observable<LocationModel[]>;
  public selectedLocation: LocationModel;
  public showAutocomplete = false;

  private readonly minSearchCharacters = 3;

  constructor(private readonly locationService: LocationService, fb: FormBuilder) {
    this.findLocationForm =  fb.group({
      findLocationControl: [null],
    });

    this.selectedLocations$ = of([]);
  }

  public ngOnInit(): void {
    this.locations$ = this.getLocations('');

    this.findLocationForm.controls.findLocationControl.valueChanges.subscribe(value => {
      this.search(value);
    });
  }

  public filter(term: string) {
     this.getLocations(term).pipe(
        mergeMap((apiData: LocationModel[]) => this.selectedLocations$.pipe(
        map((selectedLocations) => apiData.filter(apiLocation => !selectedLocations.map(x => x.court_venue_id).includes(apiLocation.court_venue_id)))
      ))
    ).subscribe(locations => {
        this.locations$ = of(locations);
    });
  }

  public search(currentValue: string) {
    this.showAutocomplete = !!currentValue && (currentValue.length >= this.minSearchCharacters);
    if (this.showAutocomplete) {
      this.filter(currentValue);
    }
  }

  public onSelectionChange(selection?: LocationModel) {
    this.selectedLocation = selection;
  }

  public getLocations(term: string): Observable<LocationModel[]> {
    return this.locationService.getAllLocations(this.serviceId, this.locationType, term);
  }

  public addSelection() {
    if (this.selectedLocation) {
      this.selectedLocations$.subscribe(x => {
          x.push(this.selectedLocation);
          this.selectedLocation = null;
          this.locations$ = of([]);
      });
    }

    this.selectedLocation = undefined;
  }

  public removeSelection(location: LocationModel) {
    this.selectedLocations$.subscribe(x => {
      const index = x.findIndex(d => d.court_venue_id === location.court_venue_id);
      x.splice(index, 1);
    });
  }

  public getDisplayName(selectedLocation: LocationModel): string {
    return selectedLocation.site_name;
  }
}
