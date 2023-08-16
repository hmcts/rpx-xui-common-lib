import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressModel } from '../../models';
import { AddressOption } from '../../models/address-option.model';
import { AddressService } from '../../services/address/address.service';

@Component({
  selector: 'xuilib-write-address-field',
  styleUrls: ['./write-address.component.scss'],
  templateUrl: './write-address.component.html'
})
export class WriteAddressFieldComponent implements OnInit, OnChanges {

  public addressesService: AddressService;

  public addressField: AddressModel;

  @Input()
  public formGroup: FormGroup;

  @Input()
  public isExpanded = false;

  @Input()
  public internationalMode = false;

  @Output() public internationalModeStart = new EventEmitter<void>();

  public isInternational: boolean;
  public ukRadioChecked = false;
  public addressChosen = false;

  public addressFormGroup = new FormGroup({});
  public ukInternationalFormGroup = new FormGroup({});
  public postcode: FormControl;
  public addressList: FormControl;
  public ukAddress: FormControl;

  public addressOptions: AddressOption[];

  public missingPostcode = false;

  constructor(addressesService: AddressService) {
    this.addressesService = addressesService;
  }

  public ngOnInit(): void {
    if (!this.formGroup.get('address')) {
      this.formGroup.addControl('address', new FormControl({}));
    }
    this.ukInternationalFormGroup = new FormGroup({
      ukAddress: new FormControl()
    })
    this.postcode = new FormControl('');
    this.addressFormGroup.addControl('postcode', this.postcode);
    this.addressList = new FormControl('');
    this.addressFormGroup.addControl('address', this.addressList);
    this.ukAddress = new FormControl('');
    this.addressFormGroup.addControl('ukAddress', this.ukAddress);
  }

  public findAddress() {
    if (!this.postcode.value) {
      this.missingPostcode = true;
    } else {
      this.missingPostcode = false;
      this.addressField = null;
      const postcode = this.postcode.value;
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
      this.addressList.setValue(undefined);
      // this.refocusElement();
    }
  }

  public blankAddress() {
    this.addressField = new AddressModel();
    this.setFormValue();
    if (this.internationalMode) {
      this.internationalModeStart.emit();
    }
  }

  public shouldShowDetailFields() {
    if (this.isExpanded) {
      return true;
    }
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
    this.addressField = this.addressList.value;
    this.addressChosen = true;
    this.setFormValue();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const change = changes['addressField'];
    if (change) {
      this.setFormValue();
    }
  }

  public setInternationalAddress(event: any): void {
    let target = event.target;
    if (target.checked) {
      this.ukRadioChecked = true;
      console.log(target.id, 'is target id');
      this.isInternational = target.id === 'no';
    }
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
