import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressMessageEnum, AddressModel } from '../../models';
import { AddressOption } from '../../models/address-option.model';
import { AddressService } from '../../services/address/address.service';

@Component({
  selector: 'xuilib-write-address-field',
  styleUrls: ['./write-address.component.scss'],
  templateUrl: './write-address.component.html'
})
export class WriteAddressFieldComponent implements OnInit, OnChanges {

  @Input()
  public formGroup: FormGroup;
  @Input()
  public internationalMode = false;
  @Input()
  public isInternational: boolean;
  @Input()
  public submissionAttempted = false;
  @Input()
  public startedInternational: boolean;
  @Input()
  public addressChosen = false;

  @Output() public postcodeOptionSelected = new EventEmitter<void>();
  @Output() public internationalModeStart = new EventEmitter<void>();
  @Output() public ukAddressOptionSelected = new EventEmitter<boolean>();
  // indicated what error to display to user
  @Output() public canSelectAddress = new EventEmitter<boolean>();
  // tells parent to reset submission attempted field
  // only relevant to when user re-clicks find address
  @Output() public resetSubmission = new EventEmitter<void>();

  public addressField: AddressModel = {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    postCode: '',
    postTown: '',
    country: '',
    county: ''
  };

  public optionErrorsPresent = false;
  public addressSelectable = false;

  public addressFormGroup: FormGroup;

  public addressOptions: AddressOption[];

  public missingPostcode = false;

  public optionErrorMessage = AddressMessageEnum.NO_OPTION_SELECTED;
  public postcodeErrorMessage = AddressMessageEnum.NO_POSTCODE_SELECTED;
  public selectErrorMessage = AddressMessageEnum.SELECT_ADDRESS;

  constructor(private readonly addressesService: AddressService) {
  }

  public ngOnInit(): void {
    if (!this.formGroup.get('address')) {
      this.formGroup.addControl('address', new FormControl({}));
    }
    // set the form group relevant to only the external parent component
    this.addressFormGroup = new FormGroup({
      // relevant to international mode
      ukAddress: new FormControl(this.isInternational !== undefined ? (this.isInternational ? 'no' : 'yes') : null),
      // relevant to postocode lookup
      postcode: new FormControl(''),
      addressList: new FormControl('')
    });
  }

  public findAddress() {
    this.resetSubmission.emit();
    if (!this.addressFormGroup.get('postcode').value) {
      this.missingPostcode = true;
      this.canSelectAddress.emit(false);
    } else {
      this.missingPostcode = false;
      this.addressField = null;
      const postcode = this.addressFormGroup.get('postcode').value;
      this.addressOptions = [];
      this.addressesService.getAddressesForPostcode(postcode.replace(' ', '').toUpperCase()).subscribe(
        result => {
          result.forEach(
            address => {
              this.addressOptions.push(new AddressOption(address, null));
            }
          );
          this.addressOptions.unshift(
            new AddressOption(undefined, this.defaultLabel(this.addressOptions.length))
          );
        }, (error) => {
          // Edited this so that errors not produced if there are no results for a postcode
          console.log(`An error occurred retrieving addresses for postcode ${postcode}. ${error}`);
          this.addressOptions.unshift(
            new AddressOption(undefined, this.defaultLabel(this.addressOptions.length))
          );
        });
      this.addressFormGroup.get('addressList').setValue(undefined);
    }
  }

  public blankAddress() {
    this.setFormValue();
    this.resetSubmission.emit();
    if (this.internationalMode) {
      this.internationalModeStart.emit();
    }
  }

  public shouldShowDetailFields() {
    if (!this.formGroup.get('address')) {
      return false;
    }
    const address = this.formGroup.get('address').value;
    let hasAddress = false;
    if (address) {
      Object.keys(address).forEach((key) => {
        if (address[key] !== null) {
          hasAddress = true;
        }
      });
    }
    return hasAddress;
  }

  public addressSelected() {
    this.missingPostcode = false;
    this.addressField = this.addressFormGroup.get('addressList').value;
    this.addressChosen = true;
    this.setFormValue();
    this.postcodeOptionSelected.emit();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const addressChange = changes['addressField'];
    const internationalChange = changes['isInternational'];
    if (addressChange) {
      this.setFormValue();
    }
    if (internationalChange && this.addressFormGroup && this.addressFormGroup.get('ukAddress')) {
      this.addressFormGroup.get('ukAddress').patchValue(this.isInternational ? 'no' : 'yes');
    }
    if (!this.addressChosen && this.addressFormGroup && this.addressFormGroup.get('addressList')) {
      // resets address options on internal back
      this.addressFormGroup.get('addressList').patchValue(undefined);
    }
    this.checkIfErrorsNeeded();
  }

  private checkIfErrorsNeeded(): void {
    if (this.submissionAttempted && this.internationalMode && !this.postcodeLookupVisible()) {
      // ensure errors present when submission attmempted on international radio buttons
      this.optionErrorsPresent = true;
      this.optionErrorMessage = AddressMessageEnum.NO_OPTION_SELECTED;
    }
    else {
      this.optionErrorsPresent = false;
    }
    if (this.optionErrorsPresent && (this.addressChosen || this.isInternational !== undefined)) {
      // ensure parent errors not present when the child form group is present
      this.optionErrorsPresent = false;
    }
  }

  public setInternationalAddress(isInternational: boolean): void {
    this.isInternational = isInternational;
    this.ukAddressOptionSelected.emit(this.isInternational);
  }

  public postcodeErrorPresent(isPostcodeField: boolean): boolean {
    const checkForField = isPostcodeField ? !this.addressSelectable : this.addressSelectable;
    return this.submissionAttempted && checkForField;
  }

  public postcodeLookupVisible(): boolean {
    return !this.shouldShowDetailFields() || (!this.startedInternational && !this.addressChosen);
  }

  private defaultLabel(numberOfAddresses: number) {
    this.addressSelectable = numberOfAddresses > 0 ? true : false;
    this.canSelectAddress.emit(this.addressSelectable);
    return numberOfAddresses === 0 ? 'No address found'
      : `${numberOfAddresses}${numberOfAddresses === 1 ? ' address ' : ' addresses '}found`;
  }

  private setFormValue() {
    if (this.formGroup) {
      this.formGroup.get('address').patchValue(
        this.addressField
      );
    }
  }
}
