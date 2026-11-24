import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { FeatureToggleService } from '../../services/feature-toggle/feature-toggle.service';
import { FeatureToggleDirective } from './feature-toggle.directive';

@Component({
  template: '<section *xuilibFeatureToggle="feature">Feature content</section>',
  standalone: false
})
class FeatureToggleHostComponent {
  public feature = 'new-dashboard';
}

describe('FeatureToggleDirective', () => {
  let fixture: ComponentFixture<FeatureToggleHostComponent>;
  let featureState: BehaviorSubject<boolean>;
  let service: jasmine.SpyObj<FeatureToggleService>;

  beforeEach(() => {
    featureState = new BehaviorSubject<boolean>(false);
    service = jasmine.createSpyObj<FeatureToggleService>('FeatureToggleService', ['isEnabled']);
    service.isEnabled.and.returnValue(featureState.asObservable());

    TestBed.configureTestingModule({
      declarations: [FeatureToggleDirective, FeatureToggleHostComponent],
      providers: [{ provide: FeatureToggleService, useValue: service }]
    });

    fixture = TestBed.createComponent(FeatureToggleHostComponent);
  });

  it('subscribes to the supplied feature and keeps disabled content out of the view', () => {
    fixture.detectChanges();

    expect(service.isEnabled).toHaveBeenCalledOnceWith('new-dashboard');
    expect(fixture.nativeElement.textContent).not.toContain('Feature content');
  });

  it('creates and clears the embedded view as the feature changes', () => {
    fixture.detectChanges();

    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Feature content');

    featureState.next(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Feature content');
  });

  it('keeps one embedded view for repeated true emissions', () => {
    fixture.detectChanges();

    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);
  });

  it('renders one view when the feature is synchronously enabled on subscription', () => {
    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    fixture.destroy();
    expect(featureState.observers.length).toBe(0);
  });

  it('ignores the previous feature after rebinding', () => {
    const replacement = new BehaviorSubject<boolean>(false);
    const features: Record<string, BehaviorSubject<boolean>> = {
      'new-dashboard': featureState,
      'replacement-dashboard': replacement
    };
    service.isEnabled.and.callFake((key) => features[key].asObservable());
    fixture.detectChanges();

    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    fixture.componentInstance.feature = 'replacement-dashboard';
    fixture.detectChanges();
    expect(featureState.observers.length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(0);

    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(0);

    replacement.next(true);
    replacement.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    featureState.next(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    replacement.next(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(0);

    replacement.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    fixture.destroy();
    expect(featureState.observers.length).toBe(0);
    expect(replacement.observers.length).toBe(0);
  });

  it('retires every previous subscription during rapid feature changes', () => {
    const replacement = new BehaviorSubject<boolean>(true);
    const finalFeature = new BehaviorSubject<boolean>(true);
    const features: Record<string, BehaviorSubject<boolean>> = {
      'new-dashboard': featureState,
      'replacement-dashboard': replacement,
      'final-dashboard': finalFeature
    };
    service.isEnabled.and.callFake((key) => features[key].asObservable());
    featureState.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    fixture.componentInstance.feature = 'replacement-dashboard';
    fixture.detectChanges();
    expect(featureState.observers.length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    fixture.componentInstance.feature = 'final-dashboard';
    fixture.detectChanges();
    expect(featureState.observers.length).toBe(0);
    expect(replacement.observers.length).toBe(0);
    expect(finalFeature.observers.length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    featureState.next(false);
    replacement.next(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    finalFeature.next(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(0);

    featureState.next(true);
    replacement.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(0);

    finalFeature.next(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('section').length).toBe(1);

    fixture.destroy();
    expect(featureState.observers.length).toBe(0);
    expect(replacement.observers.length).toBe(0);
    expect(finalFeature.observers.length).toBe(0);
  });

  it('unsubscribes from feature changes when the host is destroyed', () => {
    fixture.detectChanges();
    expect(featureState.observers.length).toBe(1);

    fixture.destroy();

    expect(featureState.observers.length).toBe(0);
  });
});
