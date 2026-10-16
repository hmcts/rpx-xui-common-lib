import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorMessagesModel } from 'projects/exui-common-lib/src/public-api';

@Component({
  selector: 'app-invitation-demo',
  templateUrl: './invitation-demo.component.html',
  standalone: false
})
export class InvitationDemoComponent {
  public readonly form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    roles: new FormGroup({
      'pui-case-manager': new FormControl(false),
      'pui-user-manager': new FormControl(false),
      'pui-organisation-manager': new FormControl(false)
    })
  });

  public errors: Record<string, ErrorMessagesModel> = {};
  public submissions = 0;
  public submittedValue: unknown = null;

  public submit(): void {
    this.submissions++;
    this.submittedValue = this.form.getRawValue();
    this.errors = {};
    // Validation is supplied by this parent; the library emits every submit.
    for (const [name, message] of Object.entries({
      firstName: 'Enter a first name', lastName: 'Enter a last name', email: 'Enter a valid email address'
    })) {
      if (this.form.get(name).invalid) {
        this.errors[name] = { isInvalid: true, messages: [message] };
      }
    }
  }
}
