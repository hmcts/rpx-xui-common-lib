import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxListComponent } from './checkbox-list.component';

// example of a label function to mock
function firstExampleLabelFunction(item: any): string {
  return item.toUpperCase();
}

// second example of a label function to mock
function secondExampleLabelFunction(item: any): string {
  return item.toLowerCase();
}

describe('CheckboxListComponent', () => {
  let component: CheckboxListComponent<any>;
  let fixture: ComponentFixture<CheckboxListComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify when all checkboxes are selected', () => {
    // set the checkbox detais with preselections and expect all selected to be false
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.preselection = ['firstOption', 'secondOption'];
    component.labelFunction = firstExampleLabelFunction;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.allSelected).toBeFalsy();

    // remove the unselected checkbox and verify that all checkboxes are selected
    component.options.pop();
    fixture.detectChanges();
    expect(component.allSelected).toBeTruthy();
  });

  it('should allow preselection with objects', () => {
    component.options = [{ id: 'a', name: 'Arthur' }, { id: 'b', name: 'Bob' }];
    component.preselection = [ { id: 'c', name: 'Arthur' } ]; // Note that this is a distinct object.
    // Based on the label function, it only cares about the name (not the id).
    component.labelFunction = (item: { name: string }) => {
      return item.name;
    };
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.selection.length).toEqual(1);
    expect(component.selection[0].name).toEqual('Arthur');
    expect(component.selection[0].id).toEqual('a'); // The one in the options.
  });

  it('should prevent object preselection when it is not a valid option', () => {
    // set the checkbox detais with preselections and expect all selected to be false
    component.options = [{ id: 'a', name: 'Arthur' }, { id: 'b', name: 'Bob' }];
    component.preselection = [ { id: 'a', name: 'Albert' } ]; // Note that this is a distinct object.
    // Based on the label function, it only cares about the name.
    component.labelFunction = (item: { name: string }) => {
      return item.name;
    };
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.selection.length).toEqual(0);
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
    component.labelFunction = firstExampleLabelFunction;
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

  it('should allow getting the selected content', () => {
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
    component.labelFunction = firstExampleLabelFunction;
    fixture.detectChanges();

    // get one of the checkboxes and confirm it is available
    const element = fixture.debugElement.nativeElement;
    const checkbox = element.querySelector('input');
    expect(checkbox).not.toBe(null);

  });

  it('should not display if there are no options', () => {

    // set the labelFunction
    component.options = undefined;
    component.labelFunction = firstExampleLabelFunction;
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
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = firstExampleLabelFunction;
    fixture.detectChanges();

    // get one of the checkboxes and confirm it is available
    const element = fixture.debugElement.nativeElement;
    let checkbox = element.querySelector('input');
    expect(checkbox).not.toBe(null);

    component.options = undefined;
    fixture.detectChanges();

    // Make sure there are no checkboxes.
    checkbox = element.querySelector('input');
    expect(checkbox).toBe(null);

  });

  it('should allow hiding and re-rendering depending on options and the label function', () => {
    // set the options and labelFunction
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = firstExampleLabelFunction;
    fixture.detectChanges();

    // get one of the checkboxes and confirm it is available
    const element = fixture.debugElement.nativeElement;
    let checkbox = element.querySelector('input');
    expect(checkbox).not.toBe(null);

    // remove wrapper options
    component.options = undefined;
    fixture.detectChanges();

    // Make sure there are no checkboxes.
    checkbox = element.querySelector('input');
    expect(checkbox).toBe(null);

    // add the options and remove the labelFunction
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = undefined;
    fixture.detectChanges();

    // Make sure there are no checkboxes.
    checkbox = element.querySelector('input');
    expect(checkbox).toBe(null);

    // remove the options
    component.options = undefined;
    fixture.detectChanges();

    // Make sure there are no checkboxes.
    checkbox = element.querySelector('input');
    expect(checkbox).toBe(null);

    // set the options and labelFunction
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = firstExampleLabelFunction;
    fixture.detectChanges();

    // Make sure there are checkboxes.
    checkbox = element.querySelector('input');
    expect(checkbox).not.toBe(null);
  });

  it('should throw a select all change event',  () => {
    // mock the emitter
    spyOn(component.selectionChange, 'emit');

    // set the options for testing
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = firstExampleLabelFunction;
    fixture.detectChanges();

    // dispatch the change event
    const element = fixture.debugElement.nativeElement;
    const checkbox = element.querySelector('#select_all');
    expect(checkbox).not.toBe(null);
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // make sure event called with correct data
    expect(component.selectionChange.emit).toHaveBeenCalled();
    expect(component.selectionChange.emit).toHaveBeenCalledWith(['firstOption', 'secondOption', 'thirdOption']);

    // dispatch event again and make sure no options data is called
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectionChange.emit).toHaveBeenCalled();
    expect(component.selectionChange.emit).toHaveBeenCalledWith([]);

  });

  it('should throw a select item change event',  () => {
    // mock the emitter
    spyOn(component.selectionChange, 'emit');

    // set the options for testing
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = firstExampleLabelFunction;
    fixture.detectChanges();

    // dispatch a change event
    const element = fixture.debugElement.nativeElement;
    const firstCheckbox = element.querySelector('#select_0');
    const secondCheckbox = element.querySelector('#select_1');
    expect(firstCheckbox).not.toBe(null);
    firstCheckbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // confirm that first option gets emitted
    expect(component.selectionChange.emit).toHaveBeenCalled();
    expect(component.selectionChange.emit).toHaveBeenCalledWith(['firstOption']);

    // dispatch first change event again and confirm no options emitted
    firstCheckbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectionChange.emit).toHaveBeenCalled();
    expect(component.selectionChange.emit).toHaveBeenCalledWith([]);

    // emit second change event
    expect(secondCheckbox).not.toBe(null);
    secondCheckbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    // confirm that second option gets emitted
    expect(component.selectionChange.emit).toHaveBeenCalled();
    expect(component.selectionChange.emit).toHaveBeenCalledWith(['secondOption']);

    // dispatch first change event and verify first option is emitted with second option
    firstCheckbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectionChange.emit).toHaveBeenCalled();
    expect(component.selectionChange.emit).toHaveBeenCalledWith(['secondOption', 'firstOption']);

    // dispatch first change event again and verify only second option emitted
    firstCheckbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectionChange.emit).toHaveBeenCalled();
    expect(component.selectionChange.emit).toHaveBeenCalledWith(['secondOption']);
  });

  it('should use a label function to display edited text',  () => {
    // mock the emitter
    spyOn(component.selectionChange, 'emit');

    // set the options for testing
    component.options = ['firstOption', 'secondOption', 'thirdOption'];
    component.labelFunction = firstExampleLabelFunction;
    fixture.detectChanges();

    // verify that the label function works as expected
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelectorAll('label')[1].textContent).toContain('FIRSTOPTION');
    expect(element.querySelectorAll('label')[2].textContent).toContain('SECONDOPTION');
    expect(element.querySelectorAll('label')[3].textContent).toContain('THIRDOPTION');

    // verify that the second label function works as expected
    component.labelFunction = secondExampleLabelFunction;
    fixture.detectChanges();
    expect(element.querySelectorAll('label')[1].textContent).toContain('firstoption');
    expect(element.querySelectorAll('label')[2].textContent).toContain('secondoption');
    expect(element.querySelectorAll('label')[3].textContent).toContain('thirdoption');
  });

  it('should allow selection to be set', () => {
    component.options = [{ id: 'a', name: 'Arthur' }, { id: 'b', name: 'Bob' }];
    component.preselection = [ { id: 'c', name: 'Arthur' } ]; // Note that this is a distinct object.
    // Based on the label function, it only cares about the name (not the id).
    component.labelFunction = (item: { name: string }) => {
      return item.name;
    };
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.selection.length).toEqual(1);
    expect(component.selection[0].name).toEqual('Arthur');
    expect(component.selection[0].id).toEqual('a'); // The one in the options.

    component.selection = [ { name: 'Bob' } ];
    expect(component.selection.length).toEqual(1);
    expect(component.selection[0].name).toEqual('Bob');
    expect(component.selection[0].id).toEqual('b'); // The one in the options.

    component.selection = [ { name: 'Dave' } ];
    expect(component.selection.length).toEqual(0);
  });
});
