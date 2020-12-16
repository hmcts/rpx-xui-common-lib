import { Injectable } from '@angular/core';

// use types so we can move to stricted typing later on
export type Role = string;
export type Roles = Role[];

@Injectable()
export class RoleService {
    private pRoles: Roles = [];

    public get roles(): Roles {
        return this.pRoles;
    }

    public set roles(roles: Roles) {
        this.pRoles = roles;
    }
}
