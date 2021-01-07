import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceMessageComponent } from './service-message.component';

describe('ServiceMessageComponent', () => {
  let component: ServiceMessageComponent;
  let fixture: ComponentFixture<ServiceMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceMessageComponent],
      imports: [RouterTestingModule]
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
      const hideKey = 'caseworker-probate';
      const hideMessageSpy = spyOn(component.onHideMessage, 'emit');
      component.onHideMessageEvent(hideKey);
      expect(hideMessageSpy).toHaveBeenCalledWith(hideKey);
    });
  });
});
