import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { FeatureToggleService } from '../../services/feature-toggle/feature-toggle.service';
import { ServiceMessagesComponent } from './service-messages.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ServiceMessagesComponent', () => {
  let component: ServiceMessagesComponent;
  let fixture: ComponentFixture<ServiceMessagesComponent>;
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValue']);

  const serviceMessagesFake = {
    'caseworker-divorce': 'Divorce users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.',
    'caseworker-divorce|caseworker-probate': 'Divorce and probate users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.',
    'caseworker-notfound': 'Not found users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.',
    'caseworker-probate': 'Probate users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.',
    'caseworker-probate|caseworker-withanotherscript': 'Probate and script users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.<scr<script>Ha!</script>ipt> alert("WOW");</script>*',
    'caseworker-probate|caseworker-withscript': 'Probate and script users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.<script>alert("security alert");</script>*<link rel=\"stylesheet\" href=\"styles.css\">*'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ServiceMessagesComponent, RpxTranslationMockPipe],
      providers: [
        {
          provide: FeatureToggleService,
          useValue: mockFeatureToggleService
        }
      ]
    })
      .compileComponents();
    mockFeatureToggleService.getValue.and.returnValue(of(serviceMessagesFake));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMessagesComponent);
    component = fixture.componentInstance;
    component.userRoles = ['caseworker-divorce', 'caseworker-probate'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getServiceMessages()', () => {
    it('should get the service messages and filter according to roles', () => {
      component.getServiceMessages();
      expect(component.filteredMessages.size).toBe(5);
    });
  });

  describe('hideMessage()', () => {

    it('should add an item to the hidden message list', () => {
      const testRole = 'test-message-1';
      component.hideMessage(testRole);
      expect((component.hiddenBanners).length).toBe(1);
    });
  });
});
