import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HmctsSubNavigationComponent } from './hmcts-sub-navigation.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsSubNavigationComponent', () => {
  let component: HmctsSubNavigationComponent;
  let fixture: ComponentFixture<HmctsSubNavigationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsSubNavigationComponent, RpxTranslateMockPipe ],
      imports: [
        RouterTestingModule
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsSubNavigationComponent);
    component = fixture.componentInstance;
    component.label = 'label';
    component.items = [{text: 'text', href: 'href', active: true, total: 100}];
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
