import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'xuilib-checkbox-list',
  templateUrl: 'checkbox-list.component.html',
  styleUrls: ['checkbox-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckboxListComponent<T> implements OnChanges {

  /**
   * The options to show checkboxes for. Note that the type
   * within the array corresponds to the one for the component.
   */
  @Input() public options: T[] = [];

  /**
   * The initially-selected values to use. When the component renders,
   * the checkboxes that correspond to these values will be checked.
   */
  @Input() public preselection: T[];

  /**
   * This function is invoked for each item to display the appropriate
   * label beside the checkbox.
   */
  @Input() public labelFunction: (item: T) => string;

  /**
   * Whenever the selection changes, this event fires. What is dispatched
   * is the current selection, also retrievable from .selection.
   */
  @Output() public selectionChange: EventEmitter<T[]> = new EventEmitter<T[]>();

  /**
   * The currently selected values.
   * Note: This array is immutable, which means pushing and popping will
   * have no effect on the selected checkboxes.
   */
  public get selection(): T[] {
    return this.pSelection ? [ ...this.pSelection ] : [];
  }
  private pSelection: T[];

  /**
   * Indicates whether or not all of the items are selected.
   */
  public get allSelected(): boolean {
    return this.selection.length === this.options.length;
  }

  // Catch any changes to any of the Input() properties.
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselection'].isFirstChange) {
      console.log('setting up preselection');
      this.setupPreselection();
    }
  }

  // Set up the initially selected values.
  private setupPreselection(): void {
    if (this.preselection && this.pSelection === undefined) {
      this.pSelection = [ ...this.preselection ];
    }
  }

  /**
   * Indicates or not an item is part of the current selection.
   * @param item The item in question.
   */
  public isSelected(item: T): boolean {
    return this.selection.includes(item);
  }

  /**
   * If an item is already selected, it will be removed from the selection.
   * Otherwise, it will be added to the selection..
   */
  public toggleItemSelection(item: T): void {
    if (this.pSelection === undefined) {
      // If we don't have any selection at all yet, make it just this item.
      this.pSelection = [ item ];
    } else if (this.isSelected(item)) {
      // If this item is already selected, remove it.
      this.pSelection.splice(this.pSelection.indexOf(item), 1);
    } else {
      // If it's not selected, add it.
      this.pSelection.push(item);
    }

    // Now emit an event so any containers know about the change to selection.
    this.selectionChange.emit(this.selection);
  }

  /**
   * If all of the items are selected, deselect them all.
   * Otherwise, select them all.
   */
  public toggleSelectAll(): void {
    // Do we already have them all selected?
    if (this.allSelected) {
      // If so, clear out the selection.
      this.pSelection = [];
    } else {
      // If not, select all of them.
      this.pSelection = [ ...this.options ];
    }

    // Now emit an event so any containers know about the change to selection.
    this.selectionChange.emit(this.pSelection);
  }
}
