import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ LoadingSpinnerComponent, RpxTranslationMockPipe ],
      imports: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading text', () => {
    expect(fixture.debugElement.nativeElement.querySelector('div.spinner-inner-container p').textContent).toContain('Loading');
  });

  it('should display overriden loading text', () => {
    component.loadingText = 'Loading instead of Searching';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('div.spinner-inner-container p').textContent).toContain('Loading instead of Searching');
  });
});
