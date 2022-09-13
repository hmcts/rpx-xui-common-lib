import { async, inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { take } from 'rxjs/operators';
import { RoleGuard, RoleMatching } from './role.guard';
import { RoleService } from './role.service';


describe('RoleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [RoleGuard, RoleService]
    });
  });

  it('should create', inject([RoleGuard], (guard: RoleGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should match a single role', inject([RoleGuard, RoleService], (guard: RoleGuard, service: RoleService) => {
    service.roles = ['role_a', 'role_b'];
    guard.canActivate({ data: { roleMatching: RoleMatching.ANY, needsRole: ['role_a'] }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => {
        expect(allowed).toBe(true);
      });
  }));

  it('should match multiple roles', inject([RoleGuard, RoleService], (guard: RoleGuard, service: RoleService) => {
    service.roles = ['role_a', 'role_b'];
    guard.canActivate({ data: { roleMatching: RoleMatching.ALL, needsRole: ['role_a', 'role_b']}} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => expect(allowed).toBe(true));
  }));

  it('should fail on a single role', async(inject([RoleGuard, RoleService], (guard: RoleGuard, service: RoleService) => {
    service.roles = ['role_a', 'role_b'];
    guard.canActivate({ data: { roleMatching: RoleMatching.ANY, needsRole: ['role_c'], noRoleMatchRedirect: 'url' }} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe( allowed => expect(allowed).toEqual(jasmine.any(UrlTree)));
  })));

  it('should fail on multiple roles', inject([RoleGuard, RoleService], (guard: RoleGuard, service: RoleService) => {
    service.roles = ['role_a', 'role_b'];
    guard.canActivate({ data: { roleMatching: RoleMatching.ALL, needsRole: ['role_c', 'role_b'], noRoleMatchRedirect: 'url'}} as unknown as ActivatedRouteSnapshot)
      .pipe(take(1))
      .subscribe(allowed => expect(allowed).toEqual(jasmine.any(UrlTree)));
  }));
});
