import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { FeatureToggleGuard, FeatureToggleService } from '..';


describe('RoleGuard', () => {
  let mockService: any;
  let mockRouter: any;
  let guard: FeatureToggleGuard;

  beforeEach(() => {
    mockService = jasmine.createSpyObj<FeatureToggleService>('featureToggleService', ['getValueOnce']);
    mockRouter = jasmine.createSpyObj('router', ['navigateByUrl', 'parseUrl']);
    guard = new FeatureToggleGuard(mockService, mockRouter);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate when feature present and no expectFeatureEnabled', () => {
    mockService.getValueOnce.and.returnValue(of(true));
    guard.canActivate({ data: { needsFeaturesEnabled: ['mo-new-register-org'], title: 'Register Organisation', featureDisabledRedirect: '/register-org/register' }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => {
        expect(allowed).toBe(true);
      });
  });

  it('should deactivate when feature not present and no expectFeatureEnabled', () => {
    mockService.getValueOnce.and.returnValue(of(false));
    guard.canActivate({ data: { needsFeaturesEnabled: ['mo-new-register-org'], title: 'Register Organisation', featureDisabledRedirect: '/register-org/register' }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => {
        expect(allowed).not.toBe(true);
      });
      expect(mockRouter.parseUrl).toHaveBeenCalledWith('/register-org/register');
  });

  it('should deactivate when feature present and expectFeatureEnabled false', () => {
    mockService.getValueOnce.and.returnValue(of(true));
    guard.canActivate({ data: { needsFeaturesEnabled: ['mo-new-register-org'], expectFeatureEnabled: false, title: 'Register Organisation', featureDisabledRedirect: '/register-org/register' }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => {
        expect(allowed).not.toBe(true);
      });
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/register-org/register');
  });

  it('should activate when feature not present and expectFeatureEnabled false', () => {
    mockService.getValueOnce.and.returnValue(of(false));
    guard.canActivate({ data: { needsFeaturesEnabled: ['mo-new-register-org'], expectFeatureEnabled: false, title: 'Register Organisation', featureDisabledRedirect: '/register-org/register' }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => {
        expect(allowed).toBe(true);
      });
  });

  it('should activate when feature present and expectFeatureEnabled true', () => {
    mockService.getValueOnce.and.returnValue(of(true));
    guard.canActivate({ data: { needsFeaturesEnabled: ['mo-new-register-org'], expectFeatureEnabled: true, title: 'Register Organisation', featureDisabledRedirect: '/register-org-new/register' }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => {
        expect(allowed).toBe(true);
      });
  });

  it('should activate when feature not present and expectFeatureEnabled true ', () => {
    mockService.getValueOnce.and.returnValue(of(false));
    guard.canActivate({ data: { needsFeaturesEnabled: ['mo-new-register-org'], expectFeatureEnabled: true, title: 'Register Organisation', featureDisabledRedirect: '/register-org-new/register' }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => {
        expect(allowed).not.toBe(true);
      });
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/register-org-new/register');
  });
});
