import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription, zip } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { catchError, debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { Person, PersonRole } from '../../models';
import { FindAPersonService } from '../../services/find-person/find-person.service';

@Component({
    selector: 'xuilib-find-person',
    templateUrl: './find-person.component.html',
    styleUrls: ['./find-person.component.scss'],
    standalone: false
})

export class FindPersonComponent implements OnInit, OnDestroy {
  @Output() public personSelected = new EventEmitter<Person>();
  @Output() public personFieldChanged = new EventEmitter<void>();
  @Input() public title: string;
  @Input() public boldTitle = 'Find the person';
  @Input() public subTitle = 'Type the name of the person and select them.';
  @Input() public domain = PersonRole.ALL;
  @Input() public findPersonGroup: FormGroup = new FormGroup({});
  @Input() public selectedPerson: string;
  @Input() public submitted: boolean = true;
  @Input() public userIncluded?: boolean = false;
  @Input() public assignedUser?: string | string[];
  @Input() public placeholderContent: string = '';
  @Input() public isNoResultsShown: boolean = true;
  @Input() public showUpdatedColor: boolean = false;
  @Input() public selectedPersons: Person[] = [];
  @Input() public errorMessage: string = 'You must select a name';
  @Input() public idValue: string = '';
  @Input() public services: string = 'IA';
  @Input() public disabled: boolean = null;
  public showAutocomplete: boolean = false;
  public findPersonControl: FormControl;
  public filteredOptions: Person[] = [];
  public readonly minSearchCharacters = 2;
  private sub: Subscription;

  constructor(private readonly findPersonService: FindAPersonService, private readonly cd: ChangeDetectorRef) {
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.findPersonControl = new FormControl(this.selectedPerson);
    this.findPersonGroup.addControl('findPersonControl', this.findPersonControl);
    this.sub = this.findPersonControl.valueChanges.pipe(
      tap(() => this.showAutocomplete = false),
      tap(() => this.filteredOptions = []),
      debounceTime(300),
      tap((searchTerm) => typeof searchTerm === 'string' ? this.personSelected.emit(null) : void 0),
      filter((searchTerm: string) => searchTerm && searchTerm.length > this.minSearchCharacters),
      switchMap((searchTerm: string) => this.filter(searchTerm).pipe(
        tap(() => this.showAutocomplete = true),
        catchError(() => {
          this.filteredOptions = [];
          return of([]);
        }),
      ))
    ).subscribe((people: Person[]) => {
      this.filteredOptions = people;
      this.cd.detectChanges();
    });
  }

  public filter(searchTerm: string): Observable<Person[]> {
    const findJudicialOrCTSCPeople = this.findPersonService.find({searchTerm, userRole: this.domain, services: [this.services], userIncluded: this.userIncluded, assignedUser: this.assignedUser});
    const findCaseworkersOrAdminsOrCtsc = this.findPersonService.findCaseworkers({searchTerm, userRole: this.domain, services: [this.services], userIncluded: this.userIncluded, assignedUser: this.assignedUser});
    if (searchTerm && searchTerm.length > this.minSearchCharacters) {
      switch (this.domain) {
        case PersonRole.JUDICIAL: {
          return findJudicialOrCTSCPeople.pipe(map(persons => {
            const ids: string[] = this.selectedPersons.map(({id}) => id);
            return persons.filter(({ id }) => !ids.includes(id));
          }));
        }
        case PersonRole.ALL: {
          return zip(findJudicialOrCTSCPeople, findCaseworkersOrAdminsOrCtsc).pipe(map(separatePeople => separatePeople[0].concat(separatePeople[1])));
        }
        case PersonRole.CTSC:
        case PersonRole.LEGAL_OPERATIONS:
        case PersonRole.ADMIN: {
          return findCaseworkersOrAdminsOrCtsc;
        }
        default: {
          return of([]);
        }
      }
    }
    return of([]);
  }

  public onSelectionChange(selectedPerson: Person): void {
    this.personSelected.emit(selectedPerson);
    this.findPersonControl.setValue(this.getDisplayName(selectedPerson), {emitEvent: false, onlySelf: true});
  }

  public getDisplayName(selectedPerson: Person): string {
    if (!selectedPerson) {
      return '';
    }
    if (selectedPerson.domain === PersonRole.JUDICIAL && selectedPerson.fullName) {
      return `${selectedPerson.fullName} (${selectedPerson.email})`;
    }
    return selectedPerson.email ? `${selectedPerson.name} (${selectedPerson.email})` : selectedPerson.name;
  }

  public onInput(): void {
    this.personFieldChanged.emit();
  }
}
