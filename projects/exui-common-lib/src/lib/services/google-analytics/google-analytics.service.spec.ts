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
  let windowTestBed: Window;

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
        },
      ]
    });

    titleTestBed = TestBed.get(Title);
    windowTestBed = TestBed.get(windowToken);

  });

  it('should be created', inject([GoogleAnalyticsService], (service: GoogleAnalyticsService) => {
    expect(service).toBeTruthy();
  }));

  it('should call gtag with correct params', inject([GoogleAnalyticsService], (service: GoogleAnalyticsService) => {
    spyOn(windowTestBed as any, 'gtag').and.callThrough();
    service.event('eventName', {});
    expect((windowTestBed as any).gtag).toHaveBeenCalledWith('event', 'eventName', {});
  }));

  it('init should call router navigation end and gtag with correct config',
  inject([GoogleAnalyticsService], (service: GoogleAnalyticsService) => {
    const event = new NavigationEnd(42, '/url', '/redirect-url');
    TestBed.get(Router).events.next(event);
    spyOn(titleTestBed, 'getTitle').and.returnValue('testTitle');
    spyOn(windowTestBed as any, 'gtag').and.callThrough();
    service.init('testId');
    expect((windowTestBed as any).gtag).toHaveBeenCalledWith('config', 'testId', {
      page_path: '/redirect-url',
      page_title: 'testTitle'
    });
  }));

});
