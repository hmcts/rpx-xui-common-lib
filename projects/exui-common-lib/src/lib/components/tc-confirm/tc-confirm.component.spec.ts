import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcConfirmComponent } from './tc-confirm.component';

describe('TcConfirmComponent', () => {
  let component: TcConfirmComponent;
  let fixture: ComponentFixture<TcConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
