import {AfterContentInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {debounceTime, mergeMap} from 'rxjs/operators';
import {LocationByEPIMMSModel} from '../../models/location.model';
import {LocationService} from '../../services/locations/location.service';

@Component({
  selector: 'xuilib-search-venue',
  templateUrl: './search-venue.component.html',
  styleUrls: ['./search-venue.component.scss']
})
export class SearchVenueComponent implements OnInit, AfterContentInit {
  @Input() public control: AbstractControl;
  @Input() public disabled: boolean = null;
  @Input() public locationType: string = '';
  @Input() public selectedLocations: LocationByEPIMMSModel[];
  @Input() public serviceIds: string = '';
  @Input() public submitted?: boolean = true;
  @ViewChild('inputSelectedLocation', {read: ElementRef}) public autoCompleteInputBox: ElementRef<HTMLInputElement>;
  public findLocationFormGroup: FormGroup;
  @Input() public showAutocomplete: boolean = false;
  @Input() public displayedLocations: LocationByEPIMMSModel[];
  @Output() public locationChanged = new EventEmitter<LocationByEPIMMSModel>();
  public selectedLocation: LocationByEPIMMSModel;
  private readonly minSearchCharacters = 3;
  public keyUpSubject$: Subject<string> = new Subject();
  public readyAfterContent: boolean = false;
  public searchInProgress: boolean = false;

  constructor(private readonly locationService: LocationService, fb: FormBuilder) {
    this.findLocationFormGroup = fb.group({
      findLocationFormControl: [null],
      locationSelectedFormControl: [null]
    });
    this.selectedLocations = [];
  }

  public ngAfterContentInit(): void {
    this.readyAfterContent = true;
  }

  public ngOnInit(): void {
    this.displayedLocations = [];
    if (this.control) {
      if (this.findLocationFormGroup && this.findLocationFormGroup.controls) {
        this.findLocationFormGroup.controls.locationSelectedFormControl = this.control;
      }
    }
    this.keyUpSubject$.pipe(debounceTime(500)).subscribe(searchValue => this.search(searchValue as string));
  }

  public onKeyDown(): void {
    this.locationChanged.emit();
  }

  public onKeyUp(event: any): void {
    this.showAutocomplete = false;
    this.keyUpSubject$.next(event.target.value);
  }

  public onFocus() {
    this.showAutocomplete = false;
  }

  public get displayedLocationsDuplicationFiltered(): LocationByEPIMMSModel[] {
    return this.displayedLocations.filter(
      location => !this.selectedLocations.map(selectedLocation => selectedLocation.epimms_id).includes(location.epimms_id) && location.court_name
    );
  }

  public filter(term: string): void {
    this.getLocations(term).pipe(
      mergeMap((apiData: LocationByEPIMMSModel[]) => {
        const apiFilter = apiData.filter(
          apiLocation => !this.selectedLocations.map(selectedLocation => selectedLocation.epimms_id).includes(apiLocation.epimms_id)
        );
        this.displayedLocations = apiFilter;
        this.searchInProgress = false;
        return apiFilter;
      })
    ).subscribe(location => {
      if (term === location.court_name) {
        this.findLocationFormGroup.controls.locationSelectedFormControl.setValue(location);
        this.displayedLocations = [];
        this.locationChanged.emit(location);
        this.showAutocomplete = false;
      }
      this.searchInProgress = false;
    });
  }

  public onSelectionChange(selection?: LocationByEPIMMSModel): void {
    if (this.findLocationFormGroup.controls.findLocationFormControl instanceof FormArray) {
      (this.findLocationFormGroup.controls.locationSelectedFormControl as FormArray).push(new FormControl(selection.epimms_id));
    } else {
      this.findLocationFormGroup.controls.locationSelectedFormControl.setValue(selection);
    }
    this.locationChanged.emit(selection);
  }

  public search(currentValue: string): void {
    this.searchInProgress = true;
    this.showAutocomplete = !!currentValue && (currentValue.length >= this.minSearchCharacters);
    if (!currentValue || !currentValue.length) {
      this.findLocationFormGroup.controls.locationSelectedFormControl.markAsPristine();
      this.findLocationFormGroup.controls.locationSelectedFormControl.reset();
    }
    if (this.showAutocomplete) {
      this.filter(currentValue);
    } else {
      this.searchInProgress = false;
    }
  }

  public getDisplayName(selectedLocation: LocationByEPIMMSModel): string {
    return selectedLocation.court_name;
  }

  public getLocations(term: string): Observable<LocationByEPIMMSModel[]> {
    return this.locationService.searchLocations(this.serviceIds, this.locationType, term);
  }

  public getControlCourtNameValue(): string {
    return this.findLocationFormGroup && this.findLocationFormGroup.controls && this.findLocationFormGroup.controls.locationSelectedFormControl.value ?
      (this.findLocationFormGroup.controls.locationSelectedFormControl.value as LocationByEPIMMSModel).court_name : '';
  }
}
