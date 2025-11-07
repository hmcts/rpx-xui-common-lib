import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HmctsIdentityBarComponent } from './hmcts-identity-bar.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('HmctsIdentityBarComponent', () => {
  let component: HmctsIdentityBarComponent;
  let fixture: ComponentFixture<HmctsIdentityBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ HmctsIdentityBarComponent, RpxTranslateMockPipe ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsIdentityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show anything when there is no content', () => {
    const main = fixture.debugElement.query(By.css('.hmcts-identity-bar'));
    expect(main).toBeFalsy();
  });

  it('should have identity bar when there is content', () => {
    component.content = { name: 'name'};
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('.hmcts-identity-bar'));
    expect(main).toBeTruthy();
  });

  it('should have contained value', () => {
    component.content = { name: 'name'};
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('name');
  });

});
