import { inject, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { windowToken } from '../../window';
import { GoogleTagManagerService } from './google-tag-manager.service';

class MockTitle {
  public getTitle(): string {
    return 'mockTitle';
  }
}

const windowMock: Window = { dataLayer: [] } as any;

describe('GoogleTagManagerService', () => {
  let titleTestBed: Title;
  let windowTestBed: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        GoogleTagManagerService,
        {
          provide: Title,
          useClass: MockTitle
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
  });

  it('should be created', inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
    expect(service).toBeTruthy();
  }));

  it('should call gtag with correct params', inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
    const googleAnalyticsKey = 'GTM-XXXXXX';
    service.init(googleAnalyticsKey);

    spyOn(windowTestBed.dataLayer, 'push').and.callThrough();

    const params = {};
    service.event('eventName', params);

    expect(windowTestBed.dataLayer.push).toHaveBeenCalledWith({
      event: 'eventName',
      ...params
    });
  }));

  it('init should call router navigation end and gtag with correct config',
    inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
    const event = new NavigationEnd(42, '/url', '/redirect-url');
    (TestBed.inject(Router).events as any).next(event);
    spyOn(titleTestBed, 'getTitle').and.returnValue('testTitle');
    spyOn(windowTestBed.dataLayer, 'push').and.callThrough();
    service.init('testId');
    expect(windowTestBed.dataLayer.push).toHaveBeenCalledWith({
      event: 'pageview',
      page: {
        path: '/redirect-url',
        title: 'testTitle'
      }
    });
  }));

    it('should push virtual pageview with correct path, title, and metadata', inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
      const googleAnalyticsKey = 'GTM-XXXXXX';
      service.init(googleAnalyticsKey);
  
      // Spy on dataLayer.push
      const pushSpy = spyOn(windowTestBed.dataLayer, 'push').and.callThrough();
  
      const path = '/test/test/12345';
      const title = 'Test Question';
      const event = 'pageview';
      const metadata = {
        caseTypeId: '12345',
        jurisdictionId: 'CIVIL',
        qualifyingQuestionName: 'Test Question'
      };
  
      service.virtualPageView(event, path, title, metadata);
  
      expect(pushSpy).toHaveBeenCalledWith({
        event,
        page: {
          path,
          title
        },
        ...metadata
      });
    }));
});
