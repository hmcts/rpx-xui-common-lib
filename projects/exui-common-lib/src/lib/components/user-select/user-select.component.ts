import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDetails } from '../../models/user-details.module';

@Component({
  selector: 'xuilib-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {

  @Input() public users: UserDetails[];

  @Output() public selected = new EventEmitter<UserDetails>();

  public filteredUsers: Observable<UserDetails[]>;

  public control = new FormControl();

  constructor() { }

  public ngOnInit() {
    console.log(this.users);
    this.filteredUsers = this.control.valueChanges.pipe(
      map(v => typeof v === typeof 'string' ? this.filterUsers(v) : this.users)
    );
  }

  public displayValue(user: UserDetails): string {
    return user ? `${user.firstName} ${user.lastName} - ${user.email}` : '';
  }

  public onSelected(e: MatAutocompleteSelectedEvent) {
    this.selected.emit(e.option.value);
  }

  public clear() {
    this.control.setValue(null);
  }

  private filterUsers(value: string): UserDetails[] {
    if (value) {
      value = value.toLowerCase();
      return this.users.filter(u => {
        if (u.firstName.toLowerCase().includes(value)) {
          return true;
        }
        if (u.lastName.toLowerCase().includes(value)) {
          return true;
        }
        if (u.email.toLowerCase().includes(value)) {
          return true;
        }
        return false;
      });
  }
    return this.users;
  }
}
