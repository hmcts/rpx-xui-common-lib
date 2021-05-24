import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcDisplayHtmlComponent } from './tc-display-html.component';

describe('TcDisplayHtmlComponent', () => {
  let component: TcDisplayHtmlComponent;
  let fixture: ComponentFixture<TcDisplayHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcDisplayHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcDisplayHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
