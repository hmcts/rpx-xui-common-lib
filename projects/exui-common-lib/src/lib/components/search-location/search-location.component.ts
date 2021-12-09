import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
import { LocationByEPIMSModel } from '../../models/location.model';
import { LocationService } from '../../services/locations/location.service';

@Component({
  selector: 'exui-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})

export class SearchLocationComponent implements OnInit {
  @Input() public control: AbstractControl;
  @Input() public disabled: boolean = null;
  @Input() public locationType: string = '';
  @Input() public selectedLocations$: Observable<LocationByEPIMSModel[]>;
  @Input() public serviceIds: string = '';
  @Input() public submitted?: boolean = true;
  @ViewChild('inputSelectedLocation', {read: ElementRef}) public autoCompleteInputBox: ElementRef<HTMLInputElement>;


  public findLocationFormGroup: FormGroup;
  @Input() public showAutocomplete: boolean = false;
  @Input() public locations$: Observable<LocationByEPIMSModel[]>;

  public selectedLocation: LocationByEPIMSModel;

  private readonly minSearchCharacters = 3;
  public keyUpSubject$: Subject<string> = new Subject();

  constructor(private readonly locationService: LocationService, fb: FormBuilder) {
    this.findLocationFormGroup = fb.group({
      findLocationFormControl: [null],
      locationSelectedFormControl: [null]
    });

    this.selectedLocations$ = of([]);
  }

  public ngOnInit(): void {
    this.locations$ = of([]);

    if (this.control) {
      if (this.findLocationFormGroup && this.findLocationFormGroup.controls) {
        this.findLocationFormGroup.controls.locationSelectedFormControl =  this.control;
      }
    }

    this.keyUpSubject$.pipe(debounceTime(500)).subscribe(searchValue => this.search(searchValue as string));
  }

  public onKeyUp(event: any): void {
    this.keyUpSubject$.next(event.target.value);
  }

  public get locationSource$(): Observable<LocationByEPIMSModel[]> {
    return this.locations$ ? this.locations$.pipe(
      mergeMap((locations: LocationByEPIMSModel[]) => this.selectedLocations$.pipe(
          map((selectedLocations) => locations.filter(
            location => !selectedLocations.map(selectedLocation => selectedLocation.epims_id).includes(location.epims_id) && location.court_name
          )),
        )
      )
    ) : of([]);
  }

  public filter(term: string): void {
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

  public onSelectionChange(selection?: LocationByEPIMSModel): void {
    this.findLocationFormGroup.controls.locationSelectedFormControl.setValue(selection);
  }

  public search(currentValue: string): void {
    this.showAutocomplete = !!currentValue && (currentValue.length >= this.minSearchCharacters);

    if (!currentValue || !currentValue.length) {
      this.findLocationFormGroup.controls.locationSelectedFormControl.markAsPristine();
      this.findLocationFormGroup.controls.locationSelectedFormControl.reset();
    }

    if (this.showAutocomplete) {
      this.filter(currentValue);
    }
  }

  public getDisplayName(selectedLocation: LocationByEPIMSModel): string {
    return  selectedLocation.court_name;
  }

  public getLocations(term: string): Observable<LocationByEPIMSModel[]> {
    return this.locationService.getAllLocations(this.serviceIds, this.locationType, term);
  }

  public getControlCourtNameValue(): string {
    return this.findLocationFormGroup && this.findLocationFormGroup.controls && this.findLocationFormGroup.controls.locationSelectedFormControl.value ?
    (this.findLocationFormGroup.controls.locationSelectedFormControl.value as LocationByEPIMSModel).court_name : '';
  }
}
