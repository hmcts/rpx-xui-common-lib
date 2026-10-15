import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressService } from 'projects/exui-common-lib/src/lib/services/address/address.service';

@Component({
  selector: 'app-address-demo',
  templateUrl: './address-demo.component.html',
  providers: [AddressService],
  standalone: false
})
export class AddressDemoComponent {
  public readonly form = new FormGroup({
    address: new FormGroup({
      addressLine1: new FormControl(null),
      addressLine2: new FormControl(null),
      addressLine3: new FormControl(null),
      postTown: new FormControl(null),
      county: new FormControl(null),
      postCode: new FormControl(null),
      country: new FormControl(null)
    })
  });

  public selectedCount = 0;
  public selectable = false;
  public startedInternational = false;
  public isInternational: boolean | undefined;
}
