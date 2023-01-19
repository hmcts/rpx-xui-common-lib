import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcDisplayPlainComponent } from './tc-display-plain.component';

describe('TcDisplayPlainComponent', () => {
  let component: TcDisplayPlainComponent;
  let fixture: ComponentFixture<TcDisplayPlainComponent>;

  beforeEach(async(() => {
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
