import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetDirective } from './let.directive';

@Component({
  template: '<span *xuilibLet="value; let implicitValue; let explicitValue = xuilibLet">{{ implicitValue }}/{{ explicitValue }}</span>',
  standalone: false
})
class LetHostComponent {
  public value = 'first';
}

describe('LetDirective', () => {
  let fixture: ComponentFixture<LetHostComponent>;
  let component: LetHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LetDirective, LetHostComponent]
    });

    fixture = TestBed.createComponent(LetHostComponent);
    component = fixture.componentInstance;
  });

  it('exposes the assigned value through implicit and explicit template context', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('first/first');
  });

  it('updates both context aliases when the input value changes', () => {
    fixture.detectChanges();

    component.value = 'second';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('second/second');
  });
});
