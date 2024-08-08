import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceMessageComponent } from './service-message.component';
import { ServiceMessages } from '../../models/service-message.model';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ServiceMessageComponent', () => {
  let component: ServiceMessageComponent;
  let fixture: ComponentFixture<ServiceMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceMessageComponent, RpxTranslateMockPipe],
      imports: [RouterTestingModule],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onHideMessageEvent()', () => {
    it('should emit the id of the message to hide', () => {
      const hideKey: ServiceMessages = {
        roles: 'caseworker-probate',
        index: 1,
        message_en: 'New message',
        message_cy: 'Anyyu',
        begin: '2024-04-18T00:00:00',
        end: '2024-04-19T00:00:00'
      };
      const hideMessageSpy = spyOn(component.hideMessage, 'emit');
      component.onHideMessageEvent(hideKey);
      expect(hideMessageSpy).toHaveBeenCalledWith(hideKey);
    });
  });
});
