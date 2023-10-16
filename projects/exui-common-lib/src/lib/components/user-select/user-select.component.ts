import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDetails } from '../../models/user-details.model';

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
    this.filteredUsers = this.control.valueChanges.pipe(
      map(value => typeof value === typeof 'string' ? this.filterUsers(value) : this.users)
    );
    this.selected.emit(null);
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

  public onUserChange(newUserValue: UserDetails) {
    if (!newUserValue || !newUserValue.email) {
      this.selected.emit(null);
    }
  }

  private filterUsers(value: string): UserDetails[] {
    if (value) {
      value = value.toLowerCase();
      return this.users.filter(user => {
        if (user.firstName.toLowerCase().includes(value)) {
          return true;
        }
        if (user.lastName.toLowerCase().includes(value)) {
          return true;
        }
        if (user.email.toLowerCase().includes(value)) {
          return true;
        }
        return false;
      });
  }
    return [];
  }
}
