import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  public searchTerm: string = '';

  private readonly minSearchCharacters = 2;

  constructor(private readonly locationService: LocationService, fb: FormBuilder) {
    this.findLocationForm =  fb.group({
      findLocationControl: [null],
    });

    this.selectedLocations$ = of([]);
  }

  public ngOnInit(): void {   
    this.locations$ = this.getLocations('');
  }

  public filter(term: string): any {
    this.selectedLocations$.subscribe(selectedLocations => {
      console.log('selectedlocation', selectedLocations);     
      this.locations$ = this.getLocations(term).pipe( map(apiData => {
          console.log('api', apiData);
          return apiData.filter(apiLocation => !selectedLocations.includes(apiLocation))
      }))
    });


    // const a$ = combineLatest([
    //   this.getLocations(term),
    //   this.selectedLocations$,
    // ]);
    
    // this.locations$ = a$.pipe(
    //   map(results => {
    //     console.log('selectedLocations', results[1]);
    //     console.log('api', results[0]);
    //     return results[1].length ?
    //           results[0].filter(apiLocation => results[1].filter(selectedLocation => selectedLocation.court_venue_id !==  apiLocation.court_venue_id).length): 
    //           results[0];
    //   }), take(10)
    // );
  }

  public search(currentValue: string) {
    this.showAutocomplete = !!currentValue && (currentValue.length > this.minSearchCharacters);

    // if (this.showAutocomplete) {
      this.filter(currentValue);
    // }
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
      });
    }

    this.selectedLocation = undefined;
  }

  public removeSelection(location: LocationModel) {
    this.selectedLocations$.subscribe(x => {
      let index = x.findIndex(d => d.court_venue_id === location.court_venue_id);
      x.splice(index, 1);
    });
  }

  public getDisplayName(selectedLocation: LocationModel): string {
    return selectedLocation.site_name;
  }
}
