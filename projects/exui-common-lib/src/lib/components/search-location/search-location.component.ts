import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
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
  @Input() public disabled: boolean = false;
  @Input() public selectedLocations$: Observable<LocationModel[]>;
  @Input() public submitted?: boolean = true;
  @Input() public control: AbstractControl;
  

  public findLocationForm: FormGroup;
  public locations$: Observable<LocationModel[]>;
  public showAutocomplete: boolean = false;

  private readonly minSearchCharacters = 3;
  public keyUpSubject$: Subject<string> = new Subject();

  constructor(private readonly locationService: LocationService, fb: FormBuilder) {
    this.findLocationForm =  fb.group({
      findLocationControl: [null],
      locationSelected: [null]
    });
    
    this.selectedLocations$ = of([]);   
  }

  public ngOnInit(): void {
    this.locations$ = this.getLocations('');

    if (this.control) {
      if (this.findLocationForm && this.findLocationForm.controls) {
        this.findLocationForm.controls.locationSelected =  this.control;
      }
    }

    this.keyUpSubject$.pipe(debounceTime(500)).subscribe(searchValue => this.search(searchValue as string)); 
  }

  onKeyUp(event: any){
    this.keyUpSubject$.next(event.target.value);
  }

  public get locationSource$(): Observable<LocationModel[]> {
    return this.locations$.pipe(
      mergeMap((locations: LocationModel[]) => this.selectedLocations$.pipe
        (
          map((selectedLocations) => locations.filter(
                location => !selectedLocations.map(selectedLocation => selectedLocation.court_venue_id).includes(location.court_venue_id)
          )),       
        )
      )
    );
  }

  public filter(term: string) {
    this.getLocations(term).pipe(
        mergeMap((apiData: LocationModel[]) => this.selectedLocations$.pipe(
        map((selectedLocations) => apiData.filter(apiLocation => !selectedLocations.map(selectedLocation => selectedLocation.court_venue_id).includes(apiLocation.court_venue_id))),       
      ))
    ).subscribe(locations => {
      this.locations$ = of(locations);
    });
  }

  public onSelectionChange(selection?: LocationModel) {
    this.findLocationForm.controls.locationSelected.setValue(selection);
  }

  public search(currentValue: string) {
    this.showAutocomplete = !!currentValue && (currentValue.length >= this.minSearchCharacters);
    if (this.showAutocomplete) {
      this.filter(currentValue);
    }
  }

  public getDisplayName(selectedLocation: LocationModel): string {
    return selectedLocation.court_name;
  }

  public getLocations(term: string): Observable<LocationModel[]> {
    return this.locationService.getAllLocations(this.serviceId, this.locationType, term);
  }

  public getControlCourtNameValue() {
    return this.findLocationForm && this.findLocationForm.controls && this.findLocationForm.controls.locationSelected.value ?
    (this.findLocationForm.controls.locationSelected.value as LocationModel).court_name: '';
  }
}
