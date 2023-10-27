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

  constructor() {
  }

  public ngOnChanges(): void {
    const addressGroup = this.formGroup.get('address');
    // if there is an issue with the formgroup, ensure error styling is displayed
    this.errorsPresent = !addressGroup.valid;
  }

}
