import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterConfigOption } from '../../models';

@Component({
  selector: 'exui-search-service',
  templateUrl: './search-service.component.html',
  styleUrls: ['./search-service.component.scss']
})
export class SearchServiceComponent {
  @Input() public services: FilterConfigOption[] = [] ;
  @Input() public selectedServices: any;
  @Input() public disabled: any;
  @Input() public delay: any;
  @Input() public form: FormGroup;
  @Input() public showAutocomplete: boolean = false;
  @Output() public serviceChanged: EventEmitter<FilterConfigOption> = new EventEmitter<FilterConfigOption>();
  public readonly minSearchCharacters = 3;
  public term: string = '';

  public onInput(): void {
    // Todo
  }

  public onSelectionChanged(key: string): void {
    const selectedService = this.services.find(s => s.key === key);
    this.serviceChanged.emit(selectedService);
  }
}
