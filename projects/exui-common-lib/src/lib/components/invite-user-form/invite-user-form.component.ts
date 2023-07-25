import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'xuilib-invite-user-form',
  templateUrl: './invite-user-form.component.html',
})

export class InviteUserFormComponent {

  public isInvalid: any;

  @Output() public submitForm = new EventEmitter();
  @Input() public inviteUserForm: UntypedFormGroup;
  @Input() public set errorMessages(value: any) {
    this.isInvalid = value || {} ;
  }

  public onSubmit() {
    this.submitForm.emit();
  }
}
