import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, filter, map, mergeMap, tap} from 'rxjs/operators';
import {LocationByEPIMMSModel} from '../../models/location.model';
import {LocationService} from '../../services/locations/location.service';

@Component({
  selector: 'exui-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent implements OnInit {
  @Input() public control: AbstractControl;
  @Input() public disabled: boolean = null;
  @Input() public singleMode: boolean = false;
  @Input() public locationType: string = '';
  @Input() public serviceIds: string = '';
  @Input() public submitted?: boolean = true;
  @Input() public delay?: number = 500;
  @Input() public form: FormGroup;
  @Input() public showAutocomplete: boolean = false;
  @Input() public locations: LocationByEPIMMSModel[] = [];
  @Output() public locationSelected = new EventEmitter<LocationByEPIMMSModel>();
  @Output() public locationInputChanged: EventEmitter<string> = new EventEmitter<string>();
  public readonly minSearchCharacters = 3;
  public term: string = '';
  private pSelectedLocations: any[] = [];
  private pReset: boolean = true;

  constructor(private readonly locationService: LocationService, private readonly fb: FormBuilder, private readonly cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      searchTerm: ['']
    });
  }

  public get reset(): boolean {
    return this.pReset;
  }

  @Input()
  public set reset(value: boolean) {
    this.pReset = value;
    this.resetSearchTerm();
  }

  public get selectedLocations(): any[] {
    return this.pSelectedLocations;
  }

  @Input()
  public set selectedLocations(value: any[]) {
    this.pSelectedLocations = value;

  }

  public ngOnInit(): void {
    if (this.singleMode && this.selectedLocations.length > 0) {
      const location = this.selectedLocations[0];
      this.form.controls.searchTerm.patchValue(location.court_name, {emitEvent: false, onlySelf: true});
    }
    this.search();
  }

  public filter(term: string): void {
    this.getLocations(term).pipe(
      map((locations) => this.removeSelectedLocations(locations)
      )
    );
  }

  public onSelectionChange(location: LocationByEPIMMSModel): void {
    this.form.controls.searchTerm.patchValue(location.court_name, {emitEvent: false, onlySelf: true});
    this.locationSelected.emit(location);
  }

  public search(): void {
    this.form.controls.searchTerm.valueChanges
      .pipe(
        tap((term) => this.locationInputChanged.next(term)),
        tap(() => this.locations = []),
        tap((term) => this.term = term),
        filter(term => !!term && term.length >= this.minSearchCharacters),
        debounceTime(this.delay),
        mergeMap(value => this.getLocations(value)),
        map((locations) => this.removeSelectedLocations(locations))
      ).subscribe(locations => {
      this.locations = locations;
      this.cd.markForCheck();
      if (locations.length === 1 && this.term === locations[0].court_name && !this.singleMode) {
        this.locationSelected.emit(locations[0]);
        this.showAutocomplete = false;
        return;
      }
      this.showAutocomplete = true;
    });
  }

  public getLocations(term: string): Observable<LocationByEPIMMSModel[]> {
    return this.locationService.getAllLocations(this.serviceIds, this.locationType, term);
  }

  public resetSearchTerm(): void {
    this.form.controls.searchTerm.patchValue('', {emitEvent: false, onlySelf: true});
  }

  private removeSelectedLocations(locations: LocationByEPIMMSModel[]): LocationByEPIMMSModel[] {
    if (this.singleMode) {
      return locations;
    }
    return locations.filter(
      location => !this.selectedLocations.map(selectedLocation => selectedLocation.epimms_id).includes(location.epimms_id) && location.court_name
    );
  }
}
