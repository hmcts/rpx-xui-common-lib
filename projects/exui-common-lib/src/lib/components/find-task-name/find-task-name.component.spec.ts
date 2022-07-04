import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTaskNameComponent } from './find-task-name.component';

describe('FindTaskNameComponent', () => {
  let component: FindTaskNameComponent;
  let fixture: ComponentFixture<FindTaskNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindTaskNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindTaskNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
