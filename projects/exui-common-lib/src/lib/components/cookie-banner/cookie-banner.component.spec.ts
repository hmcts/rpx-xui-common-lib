import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CookieService } from '../../services/cookie/cookie.service';
import { windowToken } from '../../window';
import { CookieBannerComponent } from './cookie-banner.component';

const windowMock: Window = { location: { reload: () => {}}} as any;

describe('CookieBannerComponent', () => {
  let appComponent: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;
  let cookieService: any;

  beforeEach(waitForAsync(() => {
    cookieService = jasmine.createSpyObj('CookieService', ['setCookie', 'checkCookie', 'getCookie']);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ CookieBannerComponent ],
      providers: [
        { provide: CookieService, useValue: cookieService },
        { provide: windowToken, useValue: windowMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieBannerComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('acceptCookie()', () => {
      it('should make a setCookie call', () => {
          appComponent.acceptCookie();
          expect(cookieService.setCookie).toHaveBeenCalled();
      });
  });

  describe('rejectCookie()', () => {
      it('should make a setCookie call', () => {
          appComponent.rejectCookie();
          expect(cookieService.setCookie).toHaveBeenCalled();
      });
  });

  describe('setState()', () => {
      it('should make a checkCookie call', () => {
          appComponent.setState();
          expect(cookieService.checkCookie).toHaveBeenCalled();
      });

      it('should set isCookieBannerVisible true when there is no cookie ', () => {
          cookieService.checkCookie.and.returnValue(false);
          appComponent.setState();
          expect(appComponent.isCookieBannerVisible).toBeTruthy();
      });

      it('should set isCookieBannerVisible false when there is a cookie', () => {
          cookieService.checkCookie.and.returnValue(true);
          appComponent.setState();
          expect(appComponent.isCookieBannerVisible).toBeFalsy();
      });

      it('should notify rejection when cookie is set to false', () => {
          const notifyRejectionSpy = spyOn(appComponent, 'notifyRejection');
          cookieService.checkCookie.and.returnValue(true);
          cookieService.getCookie.and.returnValue('false');
          appComponent.setState();
          expect(notifyRejectionSpy).toHaveBeenCalled();
      });

      it('should notify acceptance when cookie is set to true', () => {
          const notifyAcceptanceSpy = spyOn(appComponent, 'notifyAcceptance');
          cookieService.checkCookie.and.returnValue(true);
          cookieService.getCookie.and.returnValue('true');
          appComponent.setState();
          expect(notifyAcceptanceSpy).toHaveBeenCalled();
      });
  });

});
