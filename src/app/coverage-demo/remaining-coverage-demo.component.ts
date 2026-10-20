import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  checkboxesBeCheckedValidator,
  dateValidator,
  radioGroupValidator
} from 'projects/exui-common-lib/src/public-api';
import { AddressService } from 'projects/exui-common-lib/src/lib/services/address/address.service';
import { CaseSharingStateService } from 'projects/exui-common-lib/src/lib/services/case-sharing-state/case-sharing-state.service';
import { CookieService } from 'projects/exui-common-lib/src/lib/services/cookie/cookie.service';
import { FilterService } from 'projects/exui-common-lib/src/lib/services/filter/filter.service';
import { FindAPersonService } from 'projects/exui-common-lib/src/lib/services/find-person/find-person.service';
import { LoadingService } from 'projects/exui-common-lib/src/lib/services/loading/loading.service';
import { LocationService } from 'projects/exui-common-lib/src/lib/services/locations/location.service';
import { FilterSetting, PersonRole, SharedCase, UserDetails } from 'projects/exui-common-lib/src/lib/models';

@Component({
  selector: 'app-remaining-coverage-demo',
  templateUrl: './remaining-coverage-demo.component.html',
  providers: [AddressService],
  standalone: false
})
export class RemainingCoverageDemoComponent {
  public readonly emptyRadioForm = new FormGroup({}, { validators: radioGroupValidator() });
  public readonly disabledRadioForm = new FormGroup({
    first: new FormControl(false),
    second: new FormControl(false)
  }, { validators: radioGroupValidator() });

  public readonly minimumCheckboxForm = new FormGroup({
    first: new FormControl(false),
    second: new FormControl(false),
    third: new FormControl(false)
  }, { validators: checkboxesBeCheckedValidator(2) });

  public readonly user: UserDetails = {
    idamId: 'follow-up-user', firstName: 'Follow', lastName: 'Up', email: 'follow-up@example.test'
  };

  public readonly shareUser: UserDetails = {
    idamId: 'follow-up-share-user', firstName: 'Share', lastName: 'User', email: 'share-user@example.test'
  };

  public readonly directCases: SharedCase[] = [
    { caseId: 'FOLLOW-001', caseTitle: 'Follow-up case', sharedWith: [this.user], pendingShares: [], pendingUnshares: [] }
  ];

  public readonly directCases$ = of(this.directCases);
  public readonly filterId = 'commonlib-follow-up-filter';
  public readonly filterSetting: FilterSetting = {
    id: this.filterId,
    fields: [{ name: 'service', value: ['civil'] }]
  };

  public filterStream$!: Observable<FilterSetting | null>;

  public addressState = 'idle';
  public addressValue: unknown = null;
  public personState = 'idle';
  public people: unknown[] = [];
  public locationState = 'idle';
  public locations: unknown[] = [];
  public cookieState = 'empty';
  public loadingState = false;
  public loadingTokens: string[] = [];
  public caseState: SharedCase[] = [];
  public letValue = 'initial value';
  public pipeValue = 'MIXED CASE';

  public readonly dateResetForm = new FormGroup({
    day: new FormControl(''), month: new FormControl(''), year: new FormControl('')
  }, { validators: dateValidator() });

  constructor(
    private readonly addressService: AddressService,
    private readonly caseSharingState: CaseSharingStateService,
    private readonly cookieService: CookieService,
    private readonly filterService: FilterService,
    private readonly findPersonService: FindAPersonService,
    private readonly loadingService: LoadingService,
    private readonly locationService: LocationService
  ) {
    this.caseSharingState.state.subscribe((cases) => this.caseState = cases);
    this.loadingService.isLoading.subscribe((isLoading) => this.loadingState = isLoading);
    this.filterStream$ = this.filterService.getStream(this.filterId);
  }

  public lookupAddress(): void {
    this.addressState = 'loading';
    this.addressService.getAddressesForPostcode('AB12CD').subscribe({
      next: (value) => {
        this.addressValue = value;
        this.addressState = 'ready';
      },
      error: () => {
        this.addressState = 'error';
        this.addressValue = null;
      }
    });
  }

  public findPeople(): void {
    this.personState = 'loading';
    this.findPersonService.findCaseworkers({
      searchTerm: 'Alex', userRole: PersonRole.ALL, services: ['CIVIL'], assignedUser: 'demo-assigned'
    }).subscribe({
      next: (value) => {
        this.people = value;
        this.personState = 'ready';
      },
      error: () => {
        this.personState = 'error';
        this.people = [];
      }
    });
  }

  public searchLocations(): void {
    this.locationState = 'loading';
    this.locationService.searchLocations('CIVIL', 'hearing', 'London').subscribe({
      next: (value) => {
        this.locations = value;
        this.locationState = 'ready';
      },
      error: () => {
        this.locationState = 'error';
        this.locations = [];
      }
    });
  }

  public setCookie(): void {
    this.cookieService.setCookie('commonlib-follow-up', 'present');
    this.cookieState = this.cookieService.getCookie('commonlib-follow-up');
  }

  public deleteCookie(): void {
    this.cookieService.deleteCookie('commonlib-follow-up');
    this.cookieState = this.cookieService.checkCookie('commonlib-follow-up') ? 'present' : 'deleted';
  }

  public registerLoading(): void {
    this.loadingTokens.push(this.loadingService.register());
  }

  public unregisterLoading(): void {
    const token = this.loadingTokens.shift();
    if (token) {
      this.loadingService.unregister(token);
    }
  }

  public setCases(): void {
    this.caseSharingState.setCases(this.directCases);
  }

  public requestShare(): void {
    this.caseSharingState.requestShare(this.shareUser);
  }

  public requestUnshare(): void {
    this.caseSharingState.requestUnshare(this.user);
  }

  public persistFilter(): void {
    this.filterService.persist(this.filterSetting, 'session');
  }

  public clearFilter(): void {
    this.filterService.clearSessionAndLocalPersistance(this.filterId);
  }

  public updateLetValue(): void {
    this.letValue = 'updated value';
  }

  public setDate(value: { day: string; month: string; year: string }): void {
    this.dateResetForm.setValue(value);
  }

  public disableRadios(): void {
    this.disabledRadioForm.controls.first.disable();
    this.disabledRadioForm.controls.second.disable();
  }

  public checkMinimumCheckboxes(): void {
    this.minimumCheckboxForm.patchValue({ first: true, second: true });
  }

  public setNonBooleanCheckboxValue(): void {
    this.minimumCheckboxForm.controls.first.setValue('true' as unknown as boolean);
  }
}
