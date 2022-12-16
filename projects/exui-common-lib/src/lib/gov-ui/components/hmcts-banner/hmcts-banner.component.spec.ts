import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsBannerComponent } from './hmcts-banner.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsBannerComponent', () => {
  let component: HmctsBannerComponent;
  let fixture: ComponentFixture<HmctsBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmctsBannerComponent, RpxTranslationMockPipe ],
      imports: [
        RouterTestingModule
      ],
      providers: [
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have create banner with css class of its type', () => {
    component.type = 'type';
    fixture.detectChanges();
    const type =  fixture.nativeElement.querySelector('.hmcts-banner--type');
    expect(type).toBeTruthy();
  });

  it('should have message inside the banner', () => {
    component.type = 'type';
    component.message = 'message';
    fixture.detectChanges();
    const message =  fixture.nativeElement.querySelector('.hmcts-banner__message');
    expect(message.textContent).toContain('message');
  });

});
