import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterConfigOption } from '../../models';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'exui-search-service',
  templateUrl: './search-service.component.html',
  styleUrls: ['./search-service.component.scss']
})
export class SearchServiceComponent {
  @Input() public options: FilterConfigOption[];
  @Input() public selectedOptions: FilterConfigOption[];
  @Input() public disabled: any;
  @Input() public showAutocomplete: boolean = false;
  @Input() public searchTerm = ''; // Removed ngModel use here for Angular best practice
  @Output() public searchTermChange: EventEmitter<string> = new EventEmitter<string>(); // Emit changes to searchTerm
  @Output() public optionChanged: EventEmitter<FilterConfigOption> = new EventEmitter<FilterConfigOption>();
  public readonly MIN_SEARCH_CHARACTERS = 3;

  public get filteredOptions(): FilterConfigOption[] {
    const remainingServices = this.options.filter((s) => !this.selectedOptions.find((ss) => ss.key === s.key));

    return this.searchTerm?.length >= this.MIN_SEARCH_CHARACTERS ?
      remainingServices.filter((s) => s.label.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : remainingServices;
  }

  // TEST-TODO
  public resetSearchTerm(): void {
    this.searchTerm = '';
    this.searchTermChange.emit(this.searchTerm); // Emit the reset value
  }

  // TEST-TODO
  // TODO: Confirm this works correctly post Angular 18 upgrade as has been changed
  public onSearchTermChanged(value: string): void {
    this.searchTerm = value;
    this.searchTermChange.emit(this.searchTerm); // Emit the updated value
  }

  public onSelectionChanged($event: MatOptionSelectionChange): void {
    const label = $event.source?.value;
    if (label && $event.source.selected) {
      const selectedService = this.options.find((s) => s.label === label);
      this.optionChanged.emit(selectedService);
    }
  }
}
