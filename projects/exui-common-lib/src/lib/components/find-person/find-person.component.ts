import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, zip } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
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
  @Input() public disabled?: boolean = null;
  @Input() public userIncluded?: boolean = false;
  @Input() public placeholderContent: string = '';
  @Input() public isNoResultsShown: boolean = false;
  @Input() public showUpdatedColor: boolean = false;
  @Input() public selectedPersons: Person[] = [];
  public showAutocomplete: boolean = false;
  public currentInputValue: string = '';

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
    if (changes['selectedPerson'] && changes['selectedPerson'].currentValue.length === 0) {
      this.currentInputValue = '';
    }
  }

  public filter(searchTerm: string): Observable<Person[]> {
    const findJudicialPeople = this.findPersonService.find({ searchTerm, jurisdiction: this.domain });
    const findCaseworkersOrAdmins = this.findPersonService.findCaseworkers({ searchTerm, jurisdiction: this.domain });
    if (searchTerm && searchTerm.length > this.minSearchCharacters) {
      switch (this.domain) {
        case PersonRole.JUDICIAL: {
          return findJudicialPeople.pipe(map(persons => {
              const ids: string[] = this.selectedPersons.map(({ id }) => id);
              return persons.filter(({ id }) => !ids.includes(id));
            }));
        }
        case PersonRole.ALL: {
          return zip(findJudicialPeople, findCaseworkersOrAdmins).pipe(map(separatePeople => separatePeople[0].concat(separatePeople[1])));
        }
        case PersonRole.CASEWORKER:
        case PersonRole.ADMIN: {
          return findCaseworkersOrAdmins;
        }
        default: {
          return of();
        }
      }
    }
    return of();
  }

  public onSelectionChange(selectedPerson?: Person) {
    this.personSelected.emit(selectedPerson);
  }

  public updatedVal(currentValue: string) {
    this.currentInputValue = currentValue;
    this.showAutocomplete = !!currentValue && (currentValue.length > this.minSearchCharacters);
  }

  public getDisplayName(selectedPerson: Person): string {
    if (selectedPerson.domain === PersonRole.JUDICIAL && selectedPerson.knownAs) {
      return `${selectedPerson.knownAs}(${selectedPerson.email})`;
    }
    return selectedPerson.email ? `${selectedPerson.name}(${selectedPerson.email})` : selectedPerson.name;
  }
}
