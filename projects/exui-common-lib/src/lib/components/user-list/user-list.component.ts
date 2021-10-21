import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationParameter } from '../../models/pagination.model';
import { User } from '../../models/user.model';

@Component({
    selector: 'xuilib-user-list',
    styleUrls: ['./user-list.component.scss'],
    templateUrl: './user-list.component.html'
})
export class UserListComponent {
    @Input() public users: User[] = [];
    @Output() public userClick = new EventEmitter<User>();

    public pagination: PaginationParameter;

    constructor() {
      this.pagination = {
        page_number: 1,
        page_size: 25
      };
    }

    public onUserClick(user: User) {
      this.userClick.emit(user);
    }

    public onPaginationHandler(pageNumber: number): void {
      this.pagination.page_number = pageNumber;
    }
}
