import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TcDisplayHtmlComponent } from './tc-display-html.component';

@Component({
  template: '<xuilib-tc-display-html><p id="terms-copy"><strong>Terms</strong></p></xuilib-tc-display-html>',
  standalone: false
})
class TestHostComponent {}

describe('TcDisplayHtmlComponent', () => {
  let component: TcDisplayHtmlComponent;
  let fixture: ComponentFixture<TcDisplayHtmlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TcDisplayHtmlComponent, TestHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcDisplayHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should project supplied terms content without adding a wrapper', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);

    hostFixture.detectChanges();

    const projected = hostFixture.nativeElement.querySelector('#terms-copy') as HTMLElement;
    expect(projected).toBeTruthy();
    expect(projected.innerHTML).toBe('<strong>Terms</strong>');
    expect(projected.parentElement.tagName.toLowerCase()).toBe('xuilib-tc-display-html');
  });
});
