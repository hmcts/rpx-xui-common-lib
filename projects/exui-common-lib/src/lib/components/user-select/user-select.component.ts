import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDetails } from '../../models/user-details.model';

@Component({
    selector: 'xuilib-user-select',
    templateUrl: './user-select.component.html',
    styleUrls: ['./user-select.component.scss'],
    standalone: false
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
    // TEST-TODO
    // these are changes made per ngModel 18 upgrade and may not be correct
    // TODO: Confirm changes are correctly picked up post Angular 18 upgrade
    this.control.valueChanges.subscribe(newUserValue => {
      if (!newUserValue || !newUserValue.email) {
        this.selected.emit(null);
      }
    });
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
