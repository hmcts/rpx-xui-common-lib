import {AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, filter, map, mergeMap, tap} from 'rxjs/operators';
import {LocationByEPIMSModel} from '../../models/location.model';
import {LocationService} from '../../services/locations/location.service';

@Component({
  selector: 'exui-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent implements OnInit, AfterContentInit {
  @Input() public control: AbstractControl;
  @Input() public disabled: boolean = null;
  @Input() public locationType: string = '';
  @Input() public serviceIds: string = '';
  @Input() public submitted?: boolean = true;
  @Input() public delay?: number = 500;
  @Input() public findLocationFormGroup: FormGroup;
  @Input() public showAutocomplete: boolean = false;
  @Input() public locations: LocationByEPIMSModel[] = [];
  @Output() public locationChanged = new EventEmitter<LocationByEPIMSModel>();
  public term: string = '';
  public readyAfterContent: boolean = false;
  public readonly minSearchCharacters = 3;
  private pSelectedLocations: any[] = [];

  constructor(private readonly locationService: LocationService, private readonly fb: FormBuilder, private readonly cd: ChangeDetectorRef) {
    this.findLocationFormGroup = this.fb.group({
      findLocationFormControl: [null],
      locationSelectedFormControl: [null]
    });
  }

  public get selectedLocations(): any[] {
    return this.pSelectedLocations;
  }

  @Input()
  public set selectedLocations(value: any[]) {
    this.pSelectedLocations = value;
    this.showAutocomplete = false;
  }

  public ngAfterContentInit(): void {
    this.readyAfterContent = true;
  }

  public ngOnInit(): void {
    if (this.control) {
      if (this.findLocationFormGroup && this.findLocationFormGroup.controls) {
        this.findLocationFormGroup.controls.locationSelectedFormControl = this.control;
      }
    }
    this.search();
  }

  public onKeyDown(): void {
    this.locationChanged.emit();
  }

  public filter(term: string): void {
    this.getLocations(term).pipe(
      map((locations) => this.removeSelectedLocations(locations)
      )
    );
  }

  public onSelectionChange(selection?: LocationByEPIMSModel): void {
    if (this.findLocationFormGroup.controls.locationSelectedFormControl instanceof FormArray) {
      (this.findLocationFormGroup.controls.locationSelectedFormControl as FormArray).push(new FormControl(selection));
    } else {
      this.findLocationFormGroup.controls.locationSelectedFormControl.setValue(selection);
    }
    this.showAutocomplete = false;
    this.locationChanged.emit(selection);
    this.locations = [];
  }

  public search(): void {
    this.findLocationFormGroup.controls.findLocationFormControl.valueChanges
      .pipe(
        tap(() => this.locations = []),
        tap(() => this.showAutocomplete = false),
        tap((term) => this.term = term),
        filter(term => !!term && term.length >= this.minSearchCharacters),
        debounceTime(this.delay),
        mergeMap(value => this.getLocations(value)),
        map((locations) => this.removeSelectedLocations(locations))
      ).subscribe(locations => {
      this.locations = locations;
      this.cd.markForCheck();
      if (locations.length === 1 && this.term === locations[0].court_name) {
        if (this.findLocationFormGroup.controls.locationSelectedFormControl instanceof FormGroup) {
          this.findLocationFormGroup.controls.locationSelectedFormControl.setValue(locations[0]);
          this.locationChanged.emit(locations[0]);
          this.showAutocomplete = false;
          return;
        }
      }
      this.showAutocomplete = true;
    });
  }

  public getLocations(term: string): Observable<LocationByEPIMSModel[]> {
    return this.locationService.getAllLocations(this.serviceIds, this.locationType, term);
  }

  public getControlCourtNameValue(): string {
    if (this.findLocationFormGroup.controls.locationSelectedFormControl instanceof FormArray) {
      const formArray = this.findLocationFormGroup.controls.locationSelectedFormControl as FormArray;
      if (formArray.length > 0) {
        const value = formArray.value[formArray.length - 1];
        return value ? formArray.value[formArray.length - 1].court_name : null;
      }
    } else {
      return this.findLocationFormGroup && this.findLocationFormGroup.controls && this.findLocationFormGroup.controls.locationSelectedFormControl.value ?
        (this.findLocationFormGroup.controls.locationSelectedFormControl.value as LocationByEPIMSModel).court_name : '';
    }
  }

  private removeSelectedLocations(locations: LocationByEPIMSModel[]): LocationByEPIMSModel[] {
    return locations.filter(
      location => !this.selectedLocations.map(selectedLocation => selectedLocation.epims_id).includes(location.epims_id) && location.court_name
    );
  }
}
