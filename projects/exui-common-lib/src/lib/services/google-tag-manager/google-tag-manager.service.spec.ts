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

const windowMock: Window = { dataLayer : []} as any;

describe('GoogleTagManagerService', () => {

  let titleTestBed: Title;
  let windowTestBed: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        GoogleTagManagerService,
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

  it('should be created', inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
    expect(service).toBeTruthy();
  }));

  it('should call gtag with correct params', inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
    spyOn((windowTestBed as any).dataLayer, 'push').and.callThrough();
    const params = {};
    service.event('eventName', params);
    expect((windowTestBed as any).dataLayer.push).toHaveBeenCalledWith({ event: 'eventName', params });
  }));

  it('init should call router navigation end and gtag with correct config',
  inject([GoogleTagManagerService], (service: GoogleTagManagerService) => {
    const event = new NavigationEnd(42, '/url', '/redirect-url');
    TestBed.get(Router).events.next(event);
    spyOn(titleTestBed, 'getTitle').and.returnValue('testTitle');
    spyOn((windowTestBed as any).dataLayer, 'push').and.callThrough();
    service.init('testId');
    expect((windowTestBed as any).dataLayer.push).toHaveBeenCalledWith({
      event: 'pageview',
      page: {
        path: '/redirect-url',
        title: 'testTitle'
      }
    });
  }));

});
