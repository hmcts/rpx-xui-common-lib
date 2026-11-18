import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models';

@Component({
    selector: 'xuilib-user-details',
    styleUrls: ['./user-details.component.scss'],
    templateUrl: './user-details.component.html',
    standalone: false
})
export class UserDetailsComponent {
    @Input() public user: User;
    @Input() public enabledAccessTypes: string[] = [];
    @Input() public editPermissionRouterLink: string;
    @Input() public warningTitle: string;
    @Input() public showEditLink: boolean = false;
    @Input() public showHelpLink: boolean = false;
    @Input() public suspendHelpLink: string;
    @Output() public suspendUserEvent = new EventEmitter<User>();
    @Input() public showSuspendUserButton = false;
    @Output() public reinvite = new EventEmitter<User>();

    public reinviteClick(user: User): void {
        this.reinvite.emit(user);
    }

    public suspendUser(suspendUser: User): void {
      this.suspendUserEvent.emit(suspendUser);
    }

    public userHasRole(theRole: string): boolean {
      if (this.user && this.user.roles) {
        return this.user.roles.includes(theRole);
      }
      return false;
    }
}
