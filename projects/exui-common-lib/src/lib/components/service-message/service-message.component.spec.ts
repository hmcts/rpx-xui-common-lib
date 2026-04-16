import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceMessageComponent } from './service-message.component';
import { ServiceMessages } from '../../models/service-message.model';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
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

  it('should sanitize html content', () => {
    const sanitizer = TestBed.inject(DomSanitizer);
    const input = '<script>alert(1)</script><p>Safe</p>';

    spyOn(sanitizer, 'sanitize').and.returnValue('<p>Safe</p>');

    const result = component.sanitizeHtml(input);

    expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.HTML, input);
    expect(result).toBe('<p>Safe</p>');
  });
});
