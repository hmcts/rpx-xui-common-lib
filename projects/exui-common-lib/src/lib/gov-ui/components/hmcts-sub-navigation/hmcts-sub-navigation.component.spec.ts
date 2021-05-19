import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsSubNavigationComponent } from './hmcts-sub-navigation.component';

describe('HmctsSubNavigationComponent', () => {
  let component: HmctsSubNavigationComponent;
  let fixture: ComponentFixture<HmctsSubNavigationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsSubNavigationComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsSubNavigationComponent);
    component = fixture.componentInstance;
    component.label = 'label';
    component.items = [{text: 'text', href: 'href', active: true}];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the hmcts-sub-navigation element', () => {
    const nav = fixture.debugElement.query(By.css('.hmcts-sub-navigation'));
    expect(nav).toBeTruthy();
  });

  it('should have contained items.text', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain('text');
  });

});
