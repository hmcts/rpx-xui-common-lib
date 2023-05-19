import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HmctsBannerComponent } from './hmcts-banner.component';

describe('HmctsBannerComponent', () => {
  let component: HmctsBannerComponent;
  let fixture: ComponentFixture<HmctsBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmctsBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsBannerComponent);
    component = fixture.componentInstance;

    component.type = 'success';
    component.message = 'This is a simple message';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create banner with css class of its type', () => {
    const bannerEl =  fixture.debugElement.query(By.css(`.hmcts-banner.hmcts-banner--${component.type}`));
    expect(bannerEl).toBeTruthy();
  });

  it('should display title if it exists & have class of its type', () => {
    component.title = 'HMCTS Banner Info Title';
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.hmcts-banner-title'));

    expect(titleEl.nativeElement.innerText).toEqual(component.title);
    expect(titleEl.nativeElement.classList).toContain(`hmcts-banner-title--${component.type}`);
  });

  it('shouldn\'t display title if it does not exist', () => {
    const titleEl = fixture.debugElement.query(By.css('.hmcts-banner-title'));
    expect(titleEl).toBeNull();
  });

  it('should display message', () => {
    const messageEl = fixture.debugElement.query(By.css('.hmcts-banner__message .hmcts-banner__message-text'));
    expect(messageEl.nativeElement.innerText).toEqual(component.message);
  });

  it('should display message in bold if messageBoldText', () => {
    component.messageBoldText = true;
    fixture.detectChanges();
    const messageEl = fixture.debugElement.query(By.css('.hmcts-banner__message'));
    expect(messageEl.nativeElement.classList).toContain('hmcts-banner__message--bold');
  });

  it('should display assistive text in the message container', () => {
    const assistiveTextEl = fixture.debugElement.query(By.css('.hmcts-banner__message .hmcts-banner__assistive'));
    expect(assistiveTextEl.nativeElement.innerText).toEqual(component.type);
  });

  it('should display icon if iconMessage (only display one) & it should match type class', () => {
    component.showMessageIcon = true;
    fixture.detectChanges();
    const iconEl = fixture.debugElement.queryAll(By.css('.hmcts-banner__icon'));
    expect(iconEl.length).toEqual(1);
    expect(iconEl[0].nativeElement.classList).toContain(`hmcts-banner__icon--${component.type}`);
  });

  it('should display icon if iconMessage and only display one', () => {
    component.showMessageIcon = true;
    fixture.detectChanges();
    const iconEl = fixture.debugElement.queryAll(By.css('.hmcts-banner__icon'));
    expect(iconEl.length).toEqual(1);
  });
});
