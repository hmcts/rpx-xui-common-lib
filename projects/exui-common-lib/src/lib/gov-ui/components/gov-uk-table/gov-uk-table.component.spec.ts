import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { GovukTableComponent } from './gov-uk-table.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GovukTableComponent', () => {
  let component: GovukTableComponent;
  let fixture: ComponentFixture<GovukTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GovukTableComponent, RpxTranslateMockPipe ],
      imports: [
        RouterModule,
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovukTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
