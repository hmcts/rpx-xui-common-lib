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

  it('unsubscribes from feature changes when the host is destroyed', () => {
    fixture.detectChanges();
    expect(featureState.observers.length).toBe(1);

    fixture.destroy();

    expect(featureState.observers.length).toBe(0);
  });
});
