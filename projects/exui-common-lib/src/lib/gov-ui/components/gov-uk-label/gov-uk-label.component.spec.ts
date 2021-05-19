import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkLabelComponent } from './gov-uk-label.component';

describe('GovUkLabelComponent', () => {
  let component: GovUkLabelComponent;
  let fixture: ComponentFixture<GovUkLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ GovUkLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkLabelComponent);
    component = fixture.componentInstance;
    component.config =  { label: 'label', name: 'Name', id: 'Id', isPageHeading: true, classes: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have h1 component when its a page heading', () => {
    component.config.isPageHeading = true;
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('h1'));
    expect(header).toBeTruthy();
  });

  it('should have no h1 component when its a page heading is false', () => {
    component.config.isPageHeading = false;
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('h1'));
    expect(header).toBeFalsy();
  });
});
