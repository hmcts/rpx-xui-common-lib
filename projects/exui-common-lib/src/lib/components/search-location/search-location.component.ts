import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import { LocationService } from '../../services/locations/location.service';
import { LocationByEPIMSModel } from '../../models/location.model';


@Component({
  selector: 'exui-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})

export class SearchLocationComponent implements OnInit {
  @Input() public serviceIds: string = '';
  @Input() public locationType: string = '';
  @Input() public disabled: boolean = false;
  // i.e. serviceIds = SSCS or serviceIds = SSCS,IA,EMPLOYMENT etc.
  // i.e. locationType = optional or hearing or case_management
  @Input() public selectedLocations$: Observable<LocationByEPIMSModel[]>;
  @Input() public submitted?: boolean = true;
  @Input() public control: AbstractControl;
  
  public findLocationForm: FormGroup;
  public showAutocomplete: boolean = false;

  public locations$: Observable<LocationByEPIMSModel[]>;
  public selectedLocation: LocationByEPIMSModel;


  private readonly minSearchCharacters = 3;
  public keyUpSubject$: Subject<string> = new Subject();

  constructor(private readonly locationService: LocationService, fb: FormBuilder) {
    this.findLocationForm = fb.group({
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

  public get locationSource$(): Observable<LocationByEPIMSModel[]> {
    return this.locations$ ? this.locations$.pipe(
      mergeMap((locations: LocationByEPIMSModel[]) => this.selectedLocations$.pipe(
          map((selectedLocations) => locations.filter(
            location => !selectedLocations.map(selectedLocation => selectedLocation.epims_id).includes(location.epims_id)
          )),       
        )
      )
    ): of([]);
  }

  public filter(term: string) {
    this.getLocations(term).pipe(
        mergeMap((apiData: LocationByEPIMSModel[]) => this.selectedLocations$.pipe(
        map((selectedLocations) => apiData.filter(
          apiLocation => !selectedLocations.map(selectedLocation => selectedLocation.epims_id).includes(apiLocation.epims_id)
        )),
      ))
    ).subscribe(locations => {
      this.locations$ = of(locations);
    });
  }

  public onSelectionChange(selection?: LocationByEPIMSModel) {
    this.findLocationForm.controls.locationSelected.setValue(selection);
  }

  public search(currentValue: string) {
    this.showAutocomplete = !!currentValue && (currentValue.length >= this.minSearchCharacters);
    if (this.showAutocomplete) {
      this.filter(currentValue);
    }
  }

  public getDisplayName(selectedLocation: LocationByEPIMSModel): string {
    return selectedLocation.court_name;
  }

  public getLocations(term: string): Observable<LocationByEPIMSModel[]> {
    return this.locationService.getAllLocations(this.serviceIds, this.locationType, term);
  }

  public getControlCourtNameValue() {
    return this.findLocationForm && this.findLocationForm.controls && this.findLocationForm.controls.locationSelected.value ?
    (this.findLocationForm.controls.locationSelected.value as LocationByEPIMSModel).court_name: '';
  }
}
