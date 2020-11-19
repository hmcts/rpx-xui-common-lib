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

// example of a label function to mock this
function exampleLabelFunction(item: any): string {
  return item.toUpperCase();
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
    // set the checkbox detais with preselections and expect all selected to be false
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.preselection = ['firstOption', 'secondOption'];
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.allSelected).toBeFalsy();

    // remove the unselected checkbox and verify that all checkboxes are selected
    component.options.pop();
    fixture.detectChanges();
    expect(component.allSelected).toBeTruthy();
  });

  it('should verify when there are options to select', () => {
    // set the initial options to be nothing and verify that there are no options
    component.options = null;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.hasOptions).toBeFalsy();

    // set the initial options to an empty array and verify that there are no options
    component.options = [];
    fixture.detectChanges();
    expect(component.hasOptions).toBeFalsy();

    // set some options up and verify that there are now options
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    fixture.detectChanges();
    expect(component.hasOptions).toBeTruthy();

    // set the initial options to an empty array again and verify that there are no options
    component.options = [];
    fixture.detectChanges();
    expect(component.hasOptions).toBeFalsy();
  });

  it('should verify when an item is selected', () => {
    // set the options and preselection for testing
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.preselection = ['firstOption', 'secondOption'];
    component.ngOnChanges();
    fixture.detectChanges();

    // verify that one option is not selected and the others are
    expect(component.isSelected('thirdOption')).toBeFalsy();
    expect(component.isSelected('firstOption')).toBeTruthy();
    expect(component.isSelected('secondOption')).toBeTruthy();
  });

  it('should allow toggling the item selection', () => {
    // set the options for testing
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    fixture.detectChanges();

    // verify that all options are not selected
    expect(component.isSelected('firstOption')).toBeFalsy();
    expect(component.isSelected('secondOption')).toBeFalsy();
    expect(component.isSelected('thirdOption')).toBeFalsy();

    // select the second option
    component.toggleItemSelection('secondOption');
    fixture.detectChanges();

    // verify that second option is selected
    expect(component.isSelected('firstOption')).toBeFalsy();
    expect(component.isSelected('secondOption')).toBeTruthy();
    expect(component.isSelected('thirdOption')).toBeFalsy();

    // remove the second option
    component.toggleItemSelection('secondOption');
    fixture.detectChanges();

    // verify that all options are not selected
    expect(component.isSelected('firstOption')).toBeFalsy();
    expect(component.isSelected('secondOption')).toBeFalsy();
    expect(component.isSelected('thirdOption')).toBeFalsy();

    // toggle all options
    component.toggleItemSelection('firstOption');
    component.toggleItemSelection('secondOption');
    component.toggleItemSelection('thirdOption');
    fixture.detectChanges();

    // verify that all options are selected
    expect(component.isSelected('firstOption')).toBeTruthy();
    expect(component.isSelected('secondOption')).toBeTruthy();
    expect(component.isSelected('thirdOption')).toBeTruthy();
  });

  it('should allow selecting or deselecting all items', () => {
    // set the options for testing
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    fixture.detectChanges();

    // verify that all options are not selected
    expect(component.isSelected('firstOption')).toBeFalsy();
    expect(component.isSelected('secondOption')).toBeFalsy();
    expect(component.isSelected('thirdOption')).toBeFalsy();

    // select all
    component.toggleSelectAll();
    fixture.detectChanges();

    // verify that all options are selected
    expect(component.isSelected('firstOption')).toBeTruthy();
    expect(component.isSelected('secondOption')).toBeTruthy();
    expect(component.isSelected('thirdOption')).toBeTruthy();

    // deselect all
    component.toggleSelectAll();
    fixture.detectChanges();

    // verify that all options are not selected
    expect(component.isSelected('firstOption')).toBeFalsy();
    expect(component.isSelected('secondOption')).toBeFalsy();
    expect(component.isSelected('thirdOption')).toBeFalsy();

  });

  it('should allow getting the selectied content', () => {
    // set the options for testing
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    fixture.detectChanges();

    // verify that nothing is selected
    expect(component.selection[0]).toBe(undefined);

    // select all
    component.toggleSelectAll();
    fixture.detectChanges();

    // verify that options are selected
    expect(component.selection.length).toBe(3);
    expect(component.selection[0]).toBe('firstOption');

    // deselect all
    component.toggleItemSelection('secondOption');
    fixture.detectChanges();

    // verify that options are selected and secondOption has been removed
    expect(component.selection.length).toBe(2);
    expect(component.selection[1]).toBe('thirdOption');

  });

  it('should display if there are options and there is a label function', () => {

    // set the options and labelFunction
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = exampleLabelFunction;
    fixture.detectChanges();

    // get one of the checkboxes and confirm it is available
    const element = fixture.debugElement.nativeElement;
    const checkbox = element.querySelector('input');
    expect(checkbox).not.toBe(null);

  });

  it('should not display if there are no options', () => {

    // set the labelFunction
    component.options = undefined;
    component.labelFunction = exampleLabelFunction;
    fixture.detectChanges();

    // get one of the checkboxes and confirm it is not available
    const element = fixture.debugElement.nativeElement;
    const checkbox = element.querySelector('input');
    expect(checkbox).toBe(null);

  });

  it('should not display if there is no label function', () => {

    // set the options
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = undefined;
    fixture.detectChanges();

    // get one of the checkboxes and confirm it is not available
    const element = fixture.debugElement.nativeElement;
    const checkbox = element.querySelector('input');
    expect(checkbox).toBe(null);

  });

  it('should not display if the options are removed', () => {
    // set the options and labelFunction
    wrapper.options = ['firstOption', 'secondOption', 'thirdOption'];
    wrapper.labelFunction = exampleLabelFunction;
    fixture.detectChanges();

    // get one of the checkboxes and confirm it is available
    const element = fixture.debugElement.nativeElement;
    let checkbox = element.querySelector('input');
    expect(checkbox).not.toBe(null);

    wrapper.options = undefined;
    fixture.detectChanges();

    // Make sure there are no checkboxes.
    checkbox = element.querySelector('input');
    expect(checkbox).toBe(null);

  });
});
