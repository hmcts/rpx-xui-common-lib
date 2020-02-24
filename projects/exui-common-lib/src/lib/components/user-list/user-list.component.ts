import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
    selector: 'xuilib-user-list',
    styleUrls: ['./user-list.component.scss'],
    templateUrl: './user-list.component.html'
})
export class UserListComponent {
    @Input() public users: User[] = [];
    @Output() public userClick = new EventEmitter<User>();

    public onUserClick(user: User) {
      this.userClick.emit(user);
    }
}
