import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SafeHtmlDirective } from './safe-html.directive';

@Component({
  standalone: false,
  template: '<div [xuilibSafeHtml]="content"></div>'
})
class TestHostComponent {
  public content = '';
}

describe('SafeHtmlDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SafeHtmlDirective, TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should render allowed html', () => {
    hostComponent.content = '<p>Read the <a href="/privacy-policy">privacy policy</a></p>';

    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('a[href="/privacy-policy"]'));
    expect(link.nativeElement.textContent).toBe('privacy policy');
  });

  it('should remove unsafe html', () => {
    hostComponent.content = '<img src=x onerror=alert(1)><p>Safe</p><script>alert(1)</script>';

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('div');
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('Safe');
  });
});
