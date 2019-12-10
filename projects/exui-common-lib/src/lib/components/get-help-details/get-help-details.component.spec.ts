import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeColour } from '../../models';
import { GetHelpDetailsComponent } from './get-help-details.component';

describe('GetHelpDetailsComponent', () => {
  let component: GetHelpDetailsComponent;
  let fixture: ComponentFixture<GetHelpDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ GetHelpDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetHelpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display html based on data', () => {
    component.data = {
      title: 'Test Title',
      badgeColour: BadgeColour.BADGE_RED,
      badgeText: 'PRIVATE BETA',
      email: 'test@justice.gov.uk',
      phone: '1111111',
      openingTimes: 'bla bla bla'
    };

    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toEqual('Test Title');
    const badge = fixture.nativeElement.querySelector('.hmcts-badge');
    expect(badge.textContent).toEqual('PRIVATE BETA');
    const badgeColour = fixture.nativeElement.querySelector('.hmcts-badge');
    expect(badgeColour).toBeTruthy();

    const email = fixture.nativeElement.querySelector('.email');
    expect(email.textContent).toContain('test@justice.gov.uk');
    const phone = fixture.nativeElement.querySelector('.phone');
    expect(phone.textContent).toContain('1111111');
    const openingTimes = fixture.nativeElement.querySelector('.opening-times');
    expect(openingTimes.textContent).toContain('bla bla bla');
  });

});
