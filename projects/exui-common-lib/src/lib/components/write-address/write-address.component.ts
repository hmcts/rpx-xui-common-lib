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

  @Output() public postcodeOptionSelected = new EventEmitter<void>();
  @Output() public internationalModeStart = new EventEmitter<void>();
  @Output() public ukAddressOptionSelected = new EventEmitter<boolean>();

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

  public addressChosen = false;

  public addressFormGroup: FormGroup;

  public addressOptions: AddressOption[];

  public missingPostcode = false;

  public optionErrorMessage = AddressMessageEnum.NO_OPTION_SELECTED;

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
    if (!this.addressFormGroup.get('postcode').value) {
      this.missingPostcode = true;
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
    this.addressField = this.addressFormGroup.get('addressList').value;
    this.addressChosen = true;
    this.setFormValue();
    this.postcodeOptionSelected.emit();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const addressChange = changes['addressField'];
    if (addressChange) {
      this.setFormValue();
    }
    this.checkIfErrorsNeeded();
  }

  private checkIfErrorsNeeded(): void {
    if (this.submissionAttempted && this.shouldShowDetailFields() && this.internationalMode && !this.addressChosen) {
      // ensure errors present when submission attmempted on international radio buttons
      this.optionErrorsPresent = true;
    } else {
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

  private defaultLabel(numberOfAddresses: number) {
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
