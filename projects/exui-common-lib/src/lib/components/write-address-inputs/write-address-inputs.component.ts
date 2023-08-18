import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressModel } from '../../models';
import { AddressOption } from '../../models/address-option.model';

@Component({
  selector: 'xuilib-write-address-inputs',
  templateUrl: './write-address-inputs.component.html'
})
export class WriteAddressInputsComponent implements OnInit {

  @Input()
  public formGroup: FormGroup;

  @Input()
  public isInternational = false;

  public addressFormGroup = new FormGroup({});

  public countyText: string;
  public postcodeOptional: string;

  public addressOptions: AddressOption[];

  public missingPostcode = false;

  constructor() {
  }

  public ngOnInit(): void {
    this.setAddressFormGroup();
  }

  private setAddressFormGroup(): void {
    if (!this.formGroup.get('address')) {
      this.setFormGroup();
      return;
    }
    const givenAddress = this.formGroup.get('address').value;
    givenAddress.postCode && givenAddress.postCode !== '' ? this.setFormGroup(givenAddress) : this.setFormGroup();
  }

  private setFormGroup(givenAddress?: AddressModel) {
    this.addressFormGroup = new FormGroup({
      buildingAndStreet: new FormControl(givenAddress ? givenAddress.addressLine1 : null, Validators.required),
      addressLine2: new FormControl(givenAddress ? givenAddress.addressLine2 : null, null),
      addressLine3: new FormControl(givenAddress ? givenAddress.addressLine3 : null, null),
      townOrCity: new FormControl(givenAddress ? givenAddress.postTown : null, Validators.required),
      county: new FormControl(givenAddress ? givenAddress.county : null, null),
      country: new FormControl(givenAddress ? givenAddress.country : null, null),
      postcode: new FormControl(givenAddress ? givenAddress.postCode : null, null)
    });
  }

}
