import { inject, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { windowToken } from '../../window';
import { GoogleAnalyticsService } from './google-analytics.service';

class MockTitle {
  public getTitle(): string {
    return 'mockTitle';
  }
}

const windowMock: Window = { gtag: () => {}} as any;

describe('GoogleAnalyticsService', () => {

  let titleTestBed: Title;
  let windowTestBed: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        GoogleAnalyticsService,
        {
          provide: Title,
          useClass: MockTitle,
        },
        {
          provide: Router,
          useValue: {
            events: new BehaviorSubject<Event>(null)
          }
        },
        {
          provide: windowToken,
          useValue: windowMock
        }
      ]
    });

    titleTestBed = TestBed.inject(Title);
    windowTestBed = TestBed.inject(windowToken);
    // Spy on gtag only once
    spyOn(windowTestBed, 'gtag').and.callThrough();
  });

  it('should be created', inject([GoogleAnalyticsService], (service: GoogleAnalyticsService) => {
    expect(service).toBeTruthy();
  }));

  it('should call gtag with correct params', inject([GoogleAnalyticsService], (service: GoogleAnalyticsService) => {
    const googleAnalyticsKey = 'GTM-XXXXXX';
    service.init(googleAnalyticsKey);

    const params = {};
    service.event('eventName', params);

    expect(windowTestBed.gtag).toHaveBeenCalledWith('event', 'eventName', params);
  }));

  it('init should call router navigation end and gtag with correct config',
    inject([GoogleAnalyticsService], (service: GoogleAnalyticsService) => {
      const event = new NavigationEnd(42, '/url', '/redirect-url');
      (TestBed.inject(Router).events as any).next(event);
      spyOn(titleTestBed, 'getTitle').and.returnValue('testTitle');
      service.init('testId');
      expect(windowTestBed.gtag).toHaveBeenCalledWith('config', 'testId', {
        page_path: '/redirect-url',
        page_title: 'testTitle'
      });
    }));
});
