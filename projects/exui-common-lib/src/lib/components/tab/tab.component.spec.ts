import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { TabComponent } from './tab.component';

@Pipe({
  name: 'rpxTranslate',
  standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatTabsModule, NoopAnimationsModule],
      declarations: [TabComponent, RpxTranslateMockPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    component.tabItems = [];
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders one material tab for each supplied item', () => {
    component.tabItems = [{ text: 'Open' }, { text: 'Closed' }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[role="tab"]').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Open');
    expect(fixture.nativeElement.textContent).toContain('Closed');
  });

  it('renders no material tabs when the item list is empty', () => {
    expect(fixture.nativeElement.querySelectorAll('[role="tab"]').length).toBe(0);
  });

  it('forwards the selected tab change event unchanged', () => {
    const event = { index: 1 };
    let emittedEvent: any;
    component.tabChange.subscribe((value) => emittedEvent = value);

    fixture.debugElement.query(By.css('mat-tab-group')).triggerEventHandler('selectedTabChange', event);

    expect(emittedEvent).toBe(event);
  });

});
