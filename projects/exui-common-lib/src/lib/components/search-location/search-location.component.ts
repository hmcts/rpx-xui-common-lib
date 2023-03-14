import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, filter, map, mergeMap, tap} from 'rxjs/operators';

import {BookingCheckType, LocationByEPIMMSModel, LocationsByService} from '../../models';
import {LocationService} from '../../services/locations/location.service';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';

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
  @Input() public bookingCheck: BookingCheckType;
  @Output() public locationSelected = new EventEmitter<LocationByEPIMMSModel>();
  @Output() public locationInputChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() public searchLocationChanged: EventEmitter<void> = new EventEmitter<void>();
  public readonly minSearchCharacters = 3;
  public term: string = '';
  private pSelectedLocations: any[] = [];
  private pReset: boolean = true;

  constructor(private readonly locationService: LocationService, private readonly sessionStorageService: SessionStorageService, private readonly fb: FormBuilder, private readonly cd: ChangeDetectorRef) {
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
      this.form.controls.searchTerm.patchValue(location.site_name, {emitEvent: false, onlySelf: true});
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
    this.form.controls.searchTerm.patchValue(location.site_name, {emitEvent: false, onlySelf: true});
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
      if (locations.length === 1 && this.term === locations[0].site_name && !this.singleMode) {
        this.locationSelected.emit(locations[0]);
        this.showAutocomplete = false;
        return;
      }
      this.showAutocomplete = true;
    });
  }

  public onInput(): void {
    this.searchLocationChanged.emit();
  }

  public getLocations(term: string): Observable<LocationByEPIMMSModel[]> {
    let userLocations;
    // Booking type info - can create more
    // NO_CHECK - All work - Do not filter out locations - Default assumption
    // BOOKINGS_AND_BASE - My work - Try to only show base locations/regions
    // POSSIBLE_BOOKINGS - Create booking screen - Show only potential bookings
    if (this.bookingCheck === BookingCheckType.BOOKINGS_AND_BASE) {
      userLocations = JSON.parse(this.sessionStorageService.getItem('userLocations')) as LocationsByService[];
    } else if (this.bookingCheck === BookingCheckType.POSSIBLE_BOOKINGS) {
      this.serviceIds = this.serviceIds && this.serviceIds.length ? this.serviceIds : JSON.parse(this.sessionStorageService.getItem('bookableServices'));
      userLocations = JSON.parse(this.sessionStorageService.getItem('bookableUserLocations')) as LocationsByService[];
    }
    // get all locations will resolve filter setting using objects above
    // if no userLocations, NO_CHECK
    // if just getting all substantive user locations, BOOKINGS_AND_BASE
    // fee paid user locations are used for POSSIBLE_BOOKINGS
    return this.locationService.getAllLocations(this.serviceIds, this.locationType, term, userLocations);
  }

  public resetSearchTerm(): void {
    this.form.controls.searchTerm.patchValue('', {emitEvent: false, onlySelf: true});
  }

  private removeSelectedLocations(locations: LocationByEPIMMSModel[]): LocationByEPIMMSModel[] {
    if (this.singleMode) {
      return locations;
    }
    return locations.filter(
      location => !this.selectedLocations.map(selectedLocation => selectedLocation.epimms_id).includes(location.epimms_id) && location.site_name
    );
  }
}
