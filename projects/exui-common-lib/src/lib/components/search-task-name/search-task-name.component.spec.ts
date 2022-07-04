import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTaskNameComponent } from './search-task-name.component';

describe('SearchTaskNameComponent', () => {
  let component: SearchTaskNameComponent;
  let fixture: ComponentFixture<SearchTaskNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTaskNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTaskNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
