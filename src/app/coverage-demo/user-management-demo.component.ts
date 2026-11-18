import { Component } from '@angular/core';
import { User } from 'projects/exui-common-lib/src/lib/models';
import { invitedUser, managementUsers } from './user-management-demo.data';

@Component({
  selector: 'app-user-management-demo',
  templateUrl: './user-management-demo.component.html',
  standalone: false
})
export class UserManagementDemoComponent {
  public readonly users = managementUsers;
  public readonly invitedUser = invitedUser;
  public selected: User = managementUsers[0];
  public pageEvents: number[] = [];
  public userEvents: User[] = [];
  public suspendEvents: User[] = [];
  public reinviteEvents: User[] = [];
  public showActions = true;

  public selectUser(user: User): void {
    this.selected = user;
    this.userEvents.push(user);
  }
}
