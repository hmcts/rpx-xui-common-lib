import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from '../../models';
import { User } from '../../models/user.model';

@Component({
    selector: 'xuilib-user-list',
    styleUrls: ['./user-list.component.scss'],
    templateUrl: './user-list.component.html',
    standalone: false
})
export class UserListComponent implements OnInit {
    @Input() public users: User[] = [];
    @Input() public currentPageNumber?: number;
    @Input() public pageTotalSize?: any;
    @Output() public userClick = new EventEmitter<User>();
    @Output() public pageChange = new EventEmitter();

    public pagination: Pagination;

    public ngOnInit() {
      this.pagination = { itemsPerPage: 50, currentPage: this.currentPageNumber, totalItems: this.pageTotalSize};
    }

    public onUserClick(user: User) {
      this.userClick.emit(user);
    }

    public emitPageClickEvent(pageNumber: any) {
      this.currentPageNumber = pageNumber;
      this.pageChange.emit(pageNumber);
    }
}
