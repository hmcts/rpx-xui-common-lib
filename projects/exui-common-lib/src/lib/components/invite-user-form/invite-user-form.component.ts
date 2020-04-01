import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'xuilib-invite-user-form',
  templateUrl: './invite-user-form.component.html',
})

export class InviteUserFormComponent {

  public isInvalid: any;

  @Output() submitForm = new EventEmitter();
  @Input() inviteUserForm: FormGroup;
  @Input() set errorMessages(value: any) {
    this.isInvalid = value || {} ;
  }

  onSubmit() {
    this.submitForm.emit();
  }
}
