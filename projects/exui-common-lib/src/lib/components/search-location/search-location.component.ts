import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { iif, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import {
  BookingCheckType, FilterConfigOption,
  FilterFieldConfig,
  LocationByEPIMMSModel,
  LocationsByService
} from '../../models';
import { RefDataService } from '../../services';
import { LocationService } from '../../services/locations/location.service';
import { SessionStorageService } from '../../services/storage/session-storage/session-storage.service';

@Component({
  selector: 'exui-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent implements OnInit {
  @Input() public form: FormGroup;
  @Input() public field: FilterFieldConfig;
  @Input() public disabled: boolean = null;
  @Input() public singleMode: boolean = false;
  @Input() public locationType: string = '';
  @Input() public serviceIds: string = '';
  @Input() public submitted?: boolean = true;
  @Input() public bookingCheck: BookingCheckType;
  @Input() public selectedLocations: LocationByEPIMMSModel[] = [];
  @Input() public propertyNameFilter: keyof LocationByEPIMMSModel = 'site_name';
  @Output() public locationSelected = new EventEmitter<LocationByEPIMMSModel>();
  @Output() public locationTermSearchInputChanged: EventEmitter<string> = new EventEmitter<string>();
  public searchTermFormControl = new FormControl('');
  public readonly minSearchCharacters = 3;
  public term: string = '';
  private pReset: boolean = true;
  public filteredList$: Observable<LocationByEPIMMSModel[] | boolean>;
  private debounceTimeInput = 300;

  public get reset(): boolean {
    return this.pReset;
  }

  @Input()
  public set reset(value: boolean) {
    this.pReset = value;
    this.resetSearchTerm();
  }

  constructor(private readonly locationService: LocationService,
              private readonly sessionStorageService: SessionStorageService,
              private readonly refDataService: RefDataService
  ) {}

  public ngOnInit(): void {
    const searchInputChanges$ = this.searchTermFormControl.valueChanges
      .pipe(
        tap((term) => this.locationTermSearchInputChanged.emit(term))
      );

    // if servicesField exists, then we should filter locations by the service codes
    if (this.field.servicesField) {
      this.filteredList$ = searchInputChanges$.pipe(
        switchMap((term: string) => iif(
          // Seems more responsive to do length 0 if locationsByServiceCodes are cached
          () => (!!term && term.length >= 0),
            this.refDataService.getLocationsByServiceCodes(
              (this.form.get(this.field.servicesField)?.value as FilterConfigOption[]).map((service) => service.key)
            ).pipe(
              // Filter locations by the search input term and the chosen property name
              map((locations) => locations
                .filter((location) => location[this.propertyNameFilter].toLowerCase().includes(term.toLowerCase()))),
              // Filter out locations that are already selected
              map((locations) => this.filterUnselectedLocations(locations, this.selectedLocations, this.singleMode)),
              // Filter out duplicate locations (by propertyNameFilter)
              map((locations) => locations.filter((location, index, array) =>
                index === array.findIndex((item) => item[this.propertyNameFilter] === location[this.propertyNameFilter])
              )),
            ),
            // Returns false if the search term is empty to not show the autocomplete field i.e. ngIf should be false
            of(false)
        )),
      );
    } else {
      this.filteredList$ = searchInputChanges$.pipe(
        // Debounce needed to prevent multiple API calls being made
        debounceTime(this.debounceTimeInput),
        switchMap((term: string) => iif(
          () => (!!term && term.length >= this.minSearchCharacters),
          this.getLocations(term).pipe(
            map((locations) => this.filterUnselectedLocations(locations, this.selectedLocations, this.singleMode)),
          ),
          of(false)
        )),
      );
    }

    if (this.singleMode && this.selectedLocations.length > 0) {
      const location = this.selectedLocations[0];
      this.searchTermFormControl.patchValue(location[this.propertyNameFilter], {emitEvent: false, onlySelf: true});
    }
  }

  public onSelectedLocation(location: LocationByEPIMMSModel): void {
    this.searchTermFormControl.patchValue(location[this.propertyNameFilter], {emitEvent: false, onlySelf: true});
    this.locationSelected.emit(location);
  }

  public getLocations(term: string): Observable<LocationByEPIMMSModel[]> {
    let userLocations: LocationsByService[];
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
    this.searchTermFormControl.setValue('');
  }

  private filterUnselectedLocations(
    locations: LocationByEPIMMSModel[],
    selectedLocations: LocationByEPIMMSModel[],
    singleMode: boolean
  ): LocationByEPIMMSModel[] {
    if (singleMode) {
      return locations;
    }
    return locations.filter(
      location => !selectedLocations.map(selectedLocation => selectedLocation.epimms_id).includes(location.epimms_id) && location[this.propertyNameFilter]
    );
  }
}
