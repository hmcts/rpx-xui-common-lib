import { Component, Input, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxListComponent } from './checkbox-list.component';

@Component({
  template: `
  <xuilib-checkbox-list [options]='options' [preselection]='preselection' [labelFunction]='labelFunction'></xuilib-checkbox-list>`
})
class WrapperComponent {
  @ViewChild(CheckboxListComponent) public appComponentRef: CheckboxListComponent<any>;
  @Input() public options: any[];
  @Input() public preselection: any[];
  @Input() public labelFunction: (item: any) => string;
}

fdescribe('CheckboxListComponent', () => {
  let component: CheckboxListComponent<any>;
  let wrapper: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxListComponent, WrapperComponent ]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.appComponentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify when all checkboxes are selected', () => {
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.preselection = ['firstOption', 'secondOption'];
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.allSelected).toBeFalsy();

    component.options.pop();
    fixture.detectChanges();
    expect(component.allSelected).toBeTruthy();
  });

  it('should verify when there are options to select', () => {
    component.options = null;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.hasOptions).toBeFalsy();

    component.options = [];
    fixture.detectChanges();
    expect(component.hasOptions).toBeFalsy();

    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    fixture.detectChanges();
    expect(component.hasOptions).toBeTruthy();

    component.options = [];
    fixture.detectChanges();
    expect(component.hasOptions).toBeFalsy();
  });

  it('should verify when an item is selected', () => {
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.preselection = ['firstOption', 'secondOption'];
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.isSelected('thirdOption')).toBeFalsy();
    expect(component.isSelected('firstOption')).toBeTruthy();

  });
});
