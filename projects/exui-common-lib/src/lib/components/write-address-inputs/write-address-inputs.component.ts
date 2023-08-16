import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    if (this.formGroup.get('ukAddress')) {
      this.formGroup.get('ukAddress').valueChanges
        .subscribe(value => {
          console.log('ukaddress is', value);
          this.setSpecificText();
        })
    }
    console.log(this.formGroup, 'is form group');
  }

  private setSpecificText(): void {
    this.countyText = this.isInternational ? 'County/ State/ Province (Optional)' : 'County';
    this.postcodeOptional = this.isInternational ? ' (Optional)' : '';
  }

  private setAddressFormGroup(): void {
    const givenAddress = this.formGroup.get('address').value;
    if (givenAddress.postCode && givenAddress.postCode != '') {
      this.addressFormGroup = new FormGroup({
        buildingAndStreet: new FormControl(givenAddress.addressLine1, Validators.required),
        addressLine2: new FormControl(givenAddress.addressLine2, null),
        addressLine3: new FormControl(givenAddress.addressLine3, null),
        townOrCity: new FormControl(givenAddress.postTown, Validators.required),
        county: new FormControl(givenAddress.county, null),
        country: new FormControl(givenAddress.country, null),
        postcode: new FormControl(givenAddress.postCode, null)
      });
    } else {
      this.addressFormGroup = new FormGroup({
        buildingAndStreet: new FormControl(null, Validators.required),
        addressLine2: new FormControl(null, null),
        addressLine3: new FormControl(null, null),
        townOrCity: new FormControl(null, Validators.required),
        county: new FormControl(null, null),
        country: new FormControl(null, null),
        postcode: new FormControl(null, null)
      });
    }
  }

}
