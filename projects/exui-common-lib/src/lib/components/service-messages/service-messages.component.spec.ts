import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RpxTranslationConfig, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { FeatureToggleService } from '../../services/feature-toggle/feature-toggle.service';
import { ServiceMessagesComponent } from './service-messages.component';
import { ServiceMessages } from '../../models/service-message.model';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ServiceMessagesComponent', () => {
  let component: ServiceMessagesComponent;
  let fixture: ComponentFixture<ServiceMessagesComponent>;
  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValue']);

  const serviceMessagesFake: ServiceMessages[] = [
    // {
    //   roles: 'caseworker-probate',
    //   index: 1,
    //   message_en: 'Divorce users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.',
    //   message_cy: 'Anyyu',
    //   begin: '2024-04-18T00:00:00',
    //   end: '2034-04-24T00:00:00'
    // },
    {
      roles: 'caseworker-divorce',
      index: 2,
      message_en: 'Divorce and probate users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.',
      message_cy: 'Anyyu',
      begin: '2024-04-18T00:00:00',
      end: '2034-05-19T00:00:00'
    },
    {
      roles: 'caseworker-probate',
      index: 3,
      message_en: 'Divorce and probate users may experience longer loading times than usual in the system.<br />Click <a href="#">here</a> to find out more.',
      message_cy: 'Anyyu',
      begin: '2024-04-18T00:00:00',
      end: '2044-04-20T00:00:00'
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ServiceMessagesComponent, RpxTranslateMockPipe],
      providers: [
        RpxTranslationService, RpxTranslationConfig,
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

  describe('call createFilteredMessages on getServiceMessages() call', () => {
    it('should get the service messages and filter according to roles', () => {
      const serveMsgSpy = spyOn<any>(component, 'createFilteredMessages');
      component.getServiceMessages();
      expect(serveMsgSpy).toHaveBeenCalled();
    });
  });
  describe('call compareDates on createFilteredMessages call', () => {
    it('should get the service messages and filter according to roles', () => {
      const dateSpy = spyOn<any>(component, 'compareDates');
      component['createFilteredMessages'](serviceMessagesFake);
      fixture.autoDetectChanges();
      expect(dateSpy).toHaveBeenCalled();
    });
  });

  describe('hideMessage()', () => {
    it('should add an item to the hidden message list', () => {
      component.hiddenBanners = [];
      component.hideMessage(serviceMessagesFake[0]);
      expect((component.hiddenBanners).length).toBe(1);
    });
  });
});
