import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsPrimaryNavigationComponent } from './hmcts-primary-navigation.component';

describe('HmctsPrimaryNavigationComponent', () => {
  let component: HmctsPrimaryNavigationComponent;
  let fixture: ComponentFixture<HmctsPrimaryNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmctsPrimaryNavigationComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsPrimaryNavigationComponent);
    component = fixture.componentInstance;
    component.userLoggedIn = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the hmcts-primary-navigation element', () => {
    const nav = fixture.debugElement.query(By.css('.hmcts-primary-navigation'));
    expect(nav).toBeTruthy();
  });
});
