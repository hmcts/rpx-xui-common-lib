import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { Person, PersonRole } from '../../models';
import { FindAPersonService } from '../../services/find-person/find-person.service';

@Component({
  selector: 'xuilib-find-person',
  templateUrl: './find-person.component.html',
  styleUrls: ['./find-person.component.scss'],
})

export class FindPersonComponent implements OnInit, OnChanges {
  @Output() public personSelected = new EventEmitter<Person>();
  @Input() public title: string;
  @Input() public boldTitle = 'Find the person';
  @Input() public subTitle = 'Type the name of the person and select them.';
  @Input() public domain = PersonRole.ALL;
  @Input() public findPersonGroup: FormGroup;
  @Input() public selectedPerson: string;
  @Input() public submitted?: boolean = true;
  @Input() public disabled?: boolean = false;
  public showAutocomplete: boolean = false;

  constructor(private readonly findPersonService: FindAPersonService) {
  }

  public findPersonControl = new FormControl();
  public filteredOptions: Observable<Person[]>;
  private readonly minSearchCharacters = 2;

  public ngOnInit(): void {
    if (!this.findPersonGroup) {
      this.findPersonGroup = new FormGroup({});
    } else {
      this.findPersonGroup.addControl('findPersonControl', this.findPersonControl);
    }
    this.filteredOptions = this.findPersonControl.valueChanges.pipe(
      startWith(''),
      switchMap(searchTerm => {
        return this.filter(searchTerm || '');
      })
    );
    this.findPersonControl.setValue(this.selectedPerson);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['domain'] && !changes['domain'].firstChange) {
      this.findPersonControl.setValue(null);
      this.selectedPerson = null;
    }
  }

  public filter(searchTerm: string): Observable<Person[]> {
    if (searchTerm && searchTerm.length > this.minSearchCharacters) {
      return this.findPersonService.find({searchTerm, jurisdiction: this.domain});
    }
    return of();
  }

  public onSelectionChange(selectedPerson?: Person) {
    this.personSelected.emit(selectedPerson);
  }

  public updatedVal(currentValue: string) {
    this.showAutocomplete = !!currentValue && (currentValue.length > this.minSearchCharacters);
  }

  public getDisplayName(selectedPerson: Person): string {
    if (selectedPerson.domain === PersonRole.JUDICIAL && selectedPerson.knownAs) {
      return `${selectedPerson.knownAs}(${selectedPerson.email})`;
    }
    return selectedPerson.email ? `${selectedPerson.name}(${selectedPerson.email})` : selectedPerson.name;
  }
}
