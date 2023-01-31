import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'exui-search-service',
  templateUrl: './search-service.component.html',
  styleUrls: ['./search-service.component.scss']
})
export class SearchServiceComponent {
  @Input() public services: any;
  @Input() public selectedServices: any;
  @Input() public disabled: any;
  @Input() public delay: any;
  @Input() public form: FormGroup;
  @Input() public showAutocomplete: boolean = false;
  public readonly minSearchCharacters = 3;
  public term: string = '';

  public onInput(): void {
    // Todo
  }

  public onSelectionChange() {
    // Todo
  }
}
