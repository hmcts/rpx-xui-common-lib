import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressMessageEnum } from '../../models';

@Component({
  selector: 'xuilib-write-address-inputs',
  templateUrl: './write-address-inputs.component.html'
})
export class WriteAddressInputsComponent implements OnChanges {

  public MESSAGE_ENUM = AddressMessageEnum;

  @Input()
  public formGroup: FormGroup;

  @Input()
  public isInternational = false;

  @Input()
  public submissionAttempted = false;

  public missingPostcode = false;

  public errorsPresent = false;

  public streetInvalid = false;
  public townInvalid = false;
  public countryInvalid = false;

  constructor() {
  }

  public ngOnChanges(): void {
    const addressGroup = this.formGroup.get('address');
    this.streetInvalid = !addressGroup.get('addressLine1').valid;
    this.townInvalid = !addressGroup.get('postTown').valid;
    this.countryInvalid = !addressGroup.get('country').valid;
    // if there is an issue with the formgroup, ensure error styling is displayed
    this.errorsPresent = !addressGroup.valid;
  }

}
