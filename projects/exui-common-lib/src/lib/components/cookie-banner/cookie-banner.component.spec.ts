import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import { CookieService } from '../../services/cookie/cookie.service';
import { windowToken } from '../../window';
import { CookieBannerComponent } from './cookie-banner.component';
import {FeatureToggleService} from "../../services";
import {of} from "rxjs";

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('CookieBannerComponent', () => {
  let appComponent: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;
  let cookieService: any;
  let mockFeature: any;
  let mockDtrum: any;
  let windowMock: Window;

  beforeEach(waitForAsync(() => {
    cookieService = jasmine.createSpyObj('CookieService', ['setCookie', 'checkCookie', 'getCookie']);
    mockFeature = jasmine.createSpyObj('FeatureToggleService', ['isEnabled']);
    mockDtrum = jasmine.createSpyObj('dtrum', ['enable', 'enableSessionReplay']);
    windowMock = { location: { reload: () => {}}, dtrum: mockDtrum } as any;
    // @ts-ignore
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ CookieBannerComponent, RpxTranslateMockPipe ],
      imports: [],
      providers: [
        { provide: CookieService, useValue: cookieService },
        { provide: windowToken, useValue: windowMock },
        { provide: FeatureToggleService, useValue: mockFeature }
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

  describe('DynaTrace', () => {
    it('should enable RUM if feature toggle is on', fakeAsync(() => {
      mockFeature.isEnabled.and.returnValue(of(true));
      appComponent.notifyAcceptance();
      expect(mockFeature.isEnabled).toHaveBeenCalled();
      tick(1000);
      expect(mockDtrum.enable).toHaveBeenCalled();
      expect(mockDtrum.enableSessionReplay).toHaveBeenCalled();
    }));

    it ('should not enable RUM if feature toggle is off', fakeAsync(() => {
      mockFeature.isEnabled.and.returnValue(of(false));
      appComponent.notifyAcceptance();
      expect(mockFeature.isEnabled).toHaveBeenCalled();
      tick(1000);
      expect(mockDtrum.enable).not.toHaveBeenCalled();
      expect(mockDtrum.enableSessionReplay).not.toHaveBeenCalled();
    }));
    it ('should disable RUM if Dynatrace object not injected', fakeAsync(() => {
      // @ts-ignore
      appComponent.window['dtrum'] = undefined;
      mockFeature.isEnabled.and.returnValue(of(true));
      appComponent.notifyAcceptance();
      expect(mockFeature.isEnabled).not.toHaveBeenCalled();
      tick(1000);
      expect(mockDtrum.enable).not.toHaveBeenCalled();
      expect(mockDtrum.enableSessionReplay).not.toHaveBeenCalled();
    }));
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
