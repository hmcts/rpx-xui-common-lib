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
    public moreResultsToGo: boolean = false;

    constructor() {
      this.pagination = {
        page_number: 1,
        page_size: 25
      };
      this.users.length
    }

    public onUserClick(user: User) {
      this.userClick.emit(user);
    }

    public getPreviousResultsPage(): void {
      if (this.pagination.page_number > 1) {
        this.pagination.page_number = this.pagination.page_number - 1;
      } else {
        this.moreResultsToGo = true;
      }
    }
  
    public getNextResultsPage(): void {
      const maxPages = Math.ceil(this.users.length / this.pagination.page_size);
      if (this.pagination.page_number < maxPages) {
        this.pagination.page_number = this.pagination.page_number + 1;
      } else {
        this.moreResultsToGo = false;
      }
    }

    public getFirstResult(rows: User[]): number {
      if (rows && rows.length > 0) {
        const currentPage = (this.pagination.page_number ? this.pagination.page_number  : 1);
        if (currentPage === 1) {
          return currentPage;
        }
        return (currentPage - 1) * this.pagination.page_size + 1;
      }
      return 0;
    }

    public getLastResult(rows: User[]): number {
      if (rows && rows.length > 0) {
        const currentPage = (this.pagination.page_number ? this.pagination.page_number  : 1);
        return (currentPage) * this.pagination.page_size;
      }
      return 0;
    }

    public getTotalResults(rows: User[]): number {
      if (rows && rows.length > 0) {
        return rows.length;
      }
      return 0;
    }
}
