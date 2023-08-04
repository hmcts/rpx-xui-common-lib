import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

  /* @ViewChildren(FocusElementDirective)
  public focusElementDirectives: QueryList<FocusElementDirective>;
 */
  public addressesService: AddressService;

  public addressField: AddressModel;

  @Input()
  public formGroup: FormGroup;

  @Input()
  public isExpanded = false;

  @Input()
  public lookupFormControl: FormControl;

  public addressFormGroup = new FormGroup({});
  public postcode: FormControl;
  public addressList: FormControl;

  public addressOptions: AddressOption[];

  public missingPostcode = false;

  constructor(addressesService: AddressService) {
    this.addressesService = addressesService;
  }

  public ngOnInit(): void {
    this.postcode = new FormControl('');
    this.addressFormGroup.addControl('postcode', this.postcode);
    this.addressList = new FormControl('');
    this.addressFormGroup.addControl('address', this.addressList);
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

/*   public refocusElement(): void {
    if (this.focusElementDirectives && this.focusElementDirectives.length > 0) {
      this.focusElementDirectives.first.focus();
    }
  } */

  public blankAddress() {
    this.addressField = new AddressModel();
    this.setFormValue();
  }

  public shouldShowDetailFields() {
    if (this.isExpanded) {
      return true;
    }
    const address = this.lookupFormControl.value;
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
    console.log('address fields', this.addressField);
    this.setFormValue();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const change = changes['addressField'];
    if (change) {
      this.setFormValue();
    }
  }

/*   public buildIdPrefix(elementId: string): string {
    return `${this.idPrefix}_${elementId}`;
  } */

  private defaultLabel(numberOfAddresses: number) {
    return numberOfAddresses === 0 ? 'No address found'
      : `${numberOfAddresses}${numberOfAddresses === 1 ? ' address ' : ' addresses '}found`;
  }

  private setFormValue() {
    if (this.lookupFormControl) {
      this.lookupFormControl.patchValue(
        this.addressField
      );
    }
    console.log(this.lookupFormControl, 'is form control');
  }
}
