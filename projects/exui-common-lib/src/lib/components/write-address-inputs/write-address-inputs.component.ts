import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressMessageEnum } from '../../models';

@Component({
  selector: 'xuilib-write-address-inputs',
  templateUrl: './write-address-inputs.component.html'
})
export class WriteAddressInputsComponent implements OnInit, OnChanges {
  public MESSAGE_ENUM = AddressMessageEnum;
  public isAddressMaxLengthEnabled: boolean;

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

  public ngOnInit(): void {
    this.isAddressMaxLengthEnabled = window.location.href.includes('manage-org') ? true : false;
  }

  public ngOnChanges(): void {
    // if there is an issue with the formgroup, ensure error styling is displayed
    this.errorsPresent = !this.formGroup.get('address').valid;
  }
}
