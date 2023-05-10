import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TcDisplayPlainComponent } from './tc-display-plain.component';

describe('TcDisplayPlainComponent', () => {
  let component: TcDisplayPlainComponent;
  let fixture: ComponentFixture<TcDisplayPlainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TcDisplayPlainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcDisplayPlainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
