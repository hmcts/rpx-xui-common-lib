import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { skipWhile } from 'rxjs/operators';

// use types so we can move to stricted typing later on
export type Role = string;
export type Roles = Role[];

@Injectable({
    providedIn: 'root'
  })
export class RoleService {
    public readonly pRoles = new BehaviorSubject<Roles>(null);
    public roles$ = this.pRoles.asObservable().pipe(skipWhile(item => item === null));

    public set roles(roles: Roles) {
        this.pRoles.next(roles);
    }
}
