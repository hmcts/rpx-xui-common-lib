import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xuilib-checkbox-list',
    templateUrl: 'checkbox-list.component.html',
    styleUrls: ['checkbox-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class CheckboxListComponent<T> implements OnChanges, AfterContentChecked {

  constructor(private readonly ref: ChangeDetectorRef) {
  }

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
   * have no effect on which checkboxes are selected.
   */
  @Input()
  public get selection(): T[] {
    return this.pSelection ? [ ...this.pSelection ] : [];
  }
  public set selection(value: T[]) {
    this.pSelection = this.getSelection(value);
  }
  private pSelection: T[];
  private pSelectionMade: boolean;

  /**
   * Indicates whether or not all of the items are selected.
   */
  public get allSelected(): boolean {
    return this.selection.length === this.options.length;
  }

  // Catch any changes to any of the Input() properties.
  public ngOnChanges(): void {
    // Set up the pre-selected values.
    this.setupPreselection();
    // Now check the current selection to make sure it's valid.
    this.checkSelection();
  }

  // checks the data projected into the component
  public ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  /**
   * Indicates whether or not there are any options to render.
   */
  public get hasOptions(): boolean {
    return this.options && this.options.length > 0;
  }

  public get isFunctional(): boolean {
    return this.labelFunction && this.hasOptions;
  }

  /**
   * Indicates whether or not an item is part of the current selection.
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

    // Indicate that the user has now made an active selection.
    this.pSelectionMade = true;

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

    // Indicate that the user has now made an active selection.
    this.pSelectionMade = true;

    // Now emit an event so any containers know about the change to selection.
    this.selectionChange.emit(this.pSelection);
  }

  /**
   * Use the labelFunction to determine whether the options include the item.
   * This is to handle partial objects being set in the pre-selection where
   * they may not be available by the same mechanism as the options.
   *
   * @param items The array of items in which to look for the item.
   * @param item The item to check in the options.
   */
  public containsItem(items: T[], item: T): boolean {
    if (this.isFunctional) {
      const itemLabel: string = this.labelFunction(item);
      return items.some(opt => {
        return this.labelFunction(opt) === itemLabel;
      });
    }
    return false;
  }

  // Simple utility function to indicate whether there is an active preselection.
  private get hasPreselection(): boolean {
    return this.preselection && this.preselection.length > 0;
  }

  // Set up the initially selected values.
  // NOTE: If the preselection changes and the user has NOT made an active selection,
  // the current selection will also be changed. As soon as the user has made an
  // active selection, however, the preselection is no longer relevant.
  private setupPreselection(): void {
    if (this.isFunctional && !this.pSelectionMade && this.hasPreselection) {
      let changed = true; // Assume this is a change.
      if (this.pSelection) {
        // If there is no difference between the arrays, this is not a change.
        changed = this.pSelection.filter((item: T) => {
          return !this.containsItem(this.preselection, item);
        }).length > 0;
      }

      // If this is a change, update the selection and then emit an
      // event so any containers know about the change to selection.
      if (changed) {
        this.pSelection = this.getSelection(this.preselection);
        this.selectionChange.emit(this.selection);
      }
    }
  }

  private getSelection(items: T[]): T[] {
    return [
      ...this.options.filter(opt => {
        return this.containsItem(items, opt);
      })
    ];
  }

  // The options have changed. Let's make sure the selection
  // doesn't contain anything that's not currently an option.
  private checkSelection(): void {
    if (this.isFunctional) {
      // Check which of the currently selected items are actually options.
      const allowedSelection: T[] = this.selection.filter((item: T) => {
        return this.containsItem(this.options, item);
      });

      // If any have dropped out, change the selection.
      if (allowedSelection.length !== this.selection.length) {
        this.pSelection = [ ...allowedSelection ];

        // And emit an event so any containers know about the change to selection.
        this.selectionChange.emit(this.selection);
      }
    }
  }
}
