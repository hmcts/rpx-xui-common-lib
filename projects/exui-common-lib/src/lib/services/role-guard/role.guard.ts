import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { RoleService } from './role.service';

export enum RoleMatching {
    ALL,
    ANY
}

@Injectable({
    providedIn: 'root'
  })
export class RoleGuard implements CanActivate {

    public constructor(
        private readonly roleService: RoleService,
        private readonly router: Router
    ) {}

    public canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
        const roles = (route.data.needsRole as string[]);
        const check = (roleRegEx: string) => {
            const regex = new RegExp(roleRegEx);
            return this.roleService.roles.some(role => regex.test(role));
        };
        const match = route.data.roleMatching === RoleMatching.ALL ? roles.every(check) : roles.some(check);

        return match || this.router.parseUrl(route.data.noRoleMatchRedirect as string);
    }
}
