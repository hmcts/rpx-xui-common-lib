import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasicUser } from '../../models/basic-user.model';

@Component({
  selector: 'xuilib-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {

  @Input() public users: BasicUser[];

  @Output() public selected = new EventEmitter<BasicUser>();

  public filteredUsers: Observable<BasicUser[]>;

  public control = new FormControl('');

  constructor() { }

  public ngOnInit() {
    this.filteredUsers = this.control.valueChanges.pipe(
      map(v => this.filterUsers(v))
    );
  }

  public displayValue(user: BasicUser): string {
    return `${user.fullName} - ${user.email}`;
  }

  public onSelected(e: MatAutocompleteSelectedEvent) {
    this.selected.emit(e.option.value);
  }

  public clear() {
    this.control.setValue('');
  }

  private filterUsers(value: string): BasicUser[] {
    value = value.toLowerCase();

    return this.users.filter(u => {
      if (u.fullName.toLowerCase().includes(value)) {
        return true;
      }
      if (u.email.toLowerCase().includes(value)) {
        return true;
      }
      return false;
    });
  }

}
