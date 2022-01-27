import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, of, zip} from 'rxjs';
import {catchError, filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {Person, PersonRole} from '../../models';
import {FindAPersonService} from '../../services/find-person/find-person.service';

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
  @Input() public submitted: boolean = true;
  @Input() public disabled: boolean = null;
  @Input() public userIncluded?: boolean = false;
  @Input() public placeholderContent: string = '';
  @Input() public isNoResultsShown: boolean = true;
  @Input() public showUpdatedColor: boolean = false;
  @Input() public selectedPersons: Person[] = [];
  @Input() public errorMessage: string = 'You must select a name';
  @Input() public idValue: string = '';
  @Input() public services: string[] = ['IA'];
  public isPersonSelectionCompleted: boolean = false;
  public showAutocomplete: boolean = false;
  public currentInputValue: string = '';
  public chosenPerson: Person = null;
  public findPersonControl = new FormControl('');
  public filteredOptions: Person[] = [];
  public readonly minSearchCharacters = 2;

  constructor(private readonly findPersonService: FindAPersonService, private readonly cd: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    if (!this.findPersonGroup) {
      this.findPersonGroup = new FormGroup({});
    } else {
      this.findPersonGroup.addControl('findPersonControl', this.findPersonControl);
    }
    this.findPersonControl.valueChanges.pipe(
      startWith(''),
      tap(() => this.showAutocomplete = false),
      tap(() => this.filteredOptions = []),
      filter(searchTerm => searchTerm && searchTerm.length > this.minSearchCharacters),
      switchMap(searchTerm => this.filter(searchTerm).pipe(
        tap(() => this.showAutocomplete = true),
        catchError(() => this.filteredOptions = []),
      ))
    ).subscribe((people: Person[]) => {
      this.filteredOptions = people;
      this.cd.detectChanges();
    });
    this.findPersonControl.setValue(this.selectedPerson);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['domain'] && !changes['domain'].firstChange) {
      this.findPersonControl.setValue(null);
      this.selectedPerson = null;
    }
    if (changes['selectedPerson'] && changes['selectedPerson'].currentValue === '') {
      this.currentInputValue = '';
      this.isPersonSelectionCompleted = false;
    }
  }

  public filter(searchTerm: string): Observable<Person[]> {
    const findJudicialPeople = this.findPersonService.find({searchTerm, userRole: this.domain, services: this.services});
    const findCaseworkersOrAdmins = this.findPersonService.findCaseworkers({searchTerm, userRole: this.domain, services: this.services});
    if (searchTerm && searchTerm.length > this.minSearchCharacters) {
      switch (this.domain) {
        case PersonRole.JUDICIAL: {
          return findJudicialPeople.pipe(map(persons => {
            const ids: string[] = this.selectedPersons.map(({id}) => id);
            return persons.filter(({id}) => !ids.includes(id));
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
          return of([]);
        }
      }
    }
    return of([]);
  }

  public onSelectionChange(selectedPerson: Person) {
    this.isPersonSelectionCompleted = true;
    this.chosenPerson = selectedPerson;
    this.personSelected.emit(selectedPerson);
    this.findPersonControl.setValue('');
  }

  public updatedVal(currentValue: string) {
    this.currentInputValue = currentValue;
    this.showAutocomplete = !!currentValue && (currentValue.length > this.minSearchCharacters);
    this.isPersonSelectionCompleted = this.getDisplayName(this.chosenPerson) === currentValue;
  }

  public getDisplayName(selectedPerson: Person): string {
    if (!selectedPerson) {
      return '';
    }
    if (selectedPerson.domain === PersonRole.JUDICIAL && selectedPerson.knownAs) {
      return `${selectedPerson.knownAs}(${selectedPerson.email})`;
    }
    return selectedPerson.email ? `${selectedPerson.name}(${selectedPerson.email})` : selectedPerson.name;
  }
}
