import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeatureToggleService } from './feature-toggle.service';

@Injectable({
    providedIn: 'root'
})
export class FeatureToggleGuard  {

    public constructor(
        private readonly featureToggleService: FeatureToggleService,
        private readonly router: Router
    ) {}

    /**
     * Usage: Add the FeatureToggleGuard as the Guard for a route, and provide the following
     * in the data array for the route:
     * - needsFeaturesEnabled: An array of feature keys that need to be enabled for this route
     * - featureDisabledRedirect: the URL to redirect to when the this route is not accessible due to disabled features
     * @param route Automatically provided by Angular
     */
    public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return combineLatest(...(route.data.needsFeaturesEnabled as string[]).map(
                feature => this.featureToggleService.getValueOnce<boolean>(feature, false)
        )).pipe(
            map(featureStatuses => featureStatuses.every(status => status)),
            map(status => status || this.router.parseUrl(route.data.featureDisabledRedirect as string))
        );
    }
}
