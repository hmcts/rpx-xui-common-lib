import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleService } from './role.service';

export enum RoleMatching {
    ALL,
    ANY
}

@Injectable({
    providedIn: 'root'
  })
export class RoleGuard  {

    public constructor(
        private readonly roleService: RoleService,
        private readonly router: Router
    ) {}

    public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
      return this.roleService.roles$.pipe(
        map(roles => {
          const canActivateRoles = (route.data.needsRole as string[]);
          const check = (roleRegEx: string) => {
            const regex = new RegExp(roleRegEx);
            return roles.some(role => regex.test(role));
          };
          const match = route.data.roleMatching === RoleMatching.ALL ? canActivateRoles.every(check) : canActivateRoles.some(check);

          return match || this.router.parseUrl(route.data.noRoleMatchRedirect as string);
        })
      );
    }
}
