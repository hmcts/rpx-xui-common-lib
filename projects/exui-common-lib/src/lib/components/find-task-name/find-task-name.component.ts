import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, filter, mergeMap, tap} from 'rxjs/operators';
import {PersonRole} from '../../models';
import { TaskNameModel } from '../../models/task-name.model';
import { TaskNameService } from '../../services/task-name/task-name.service';

@Component({
  selector: 'xuilib-find-task-name',
  templateUrl: './find-task-name.component.html',
  styleUrls: ['./find-task-name.component.scss'],
})

export class FindTaskNameComponent implements OnInit, OnDestroy {
  @Output() public taskNameSelected = new EventEmitter<string>();
  @Output() public taskNameFieldChanged = new EventEmitter<void>();
  @Input() public title: string;
  @Input() public boldTitle = 'Find the task name';
  @Input() public subTitle = 'Type the name of the task name and select them.';
  @Input() public domain = PersonRole.ALL;
  @Input() public findTaskNameGroup: FormGroup = new FormGroup({});
  @Input() public selectedTaskName: string;
  @Input() public submitted: boolean = true;
  @Input() public userIncluded?: boolean = false;
  @Input() public assignedUser?: string;
  @Input() public placeholderContent: string = '';
  @Input() public isNoResultsShown: boolean = true;
  @Input() public showUpdatedColor: boolean = false;
  @Input() public selectedTaskNames: TaskNameModel[] = [];
  @Input() public errorMessage: string = 'You must select a name';
  @Input() public idValue: string = '';
  @Input() public services: string[] = ['IA'];
  @Input() public disabled: boolean = null;
  public showAutocomplete: boolean = false;
  public findTaskNameControl: FormControl;
  public filteredOptions: TaskNameModel[] = [];
  public readonly minSearchCharacters = 1;
  private sub: Subscription;
  public searchTerm: string = '';

  constructor(private readonly cd: ChangeDetectorRef, private readonly taskService: TaskNameService) {
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.findTaskNameControl = new FormControl(this.selectedTaskName);
    this.findTaskNameGroup.addControl('findTaskNameControl', this.findTaskNameControl);
    this.sub = this.findTaskNameControl.valueChanges
    .pipe(
      tap(() => this.showAutocomplete = false),
      tap(() => this.filteredOptions = []),
      tap((term) => this.searchTerm = term),
      debounceTime(300),
      // tap((searchTerm) => typeof searchTerm === 'string' ? this.taskNameSelected.emit(null) : void 0),
      filter((searchTerm: string) => searchTerm && searchTerm.length >= this.minSearchCharacters),
      mergeMap(() => this.getTaskName()),
    ).subscribe((task: TaskNameModel[]) => {
      this.filteredOptions = task;
      if (this.searchTerm) {
        this.filteredOptions = this.filteredOptions.filter((t) => t.taskName.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase()));
      }
      this.cd.detectChanges();
    });
  }

  public getTaskName(): Observable<any[]> {
    return this.taskService.getTaskName();
}

  // public filter(searchTerm: string): Observable<Person[]> {
  //   console.log("**filter**");
  //   const findJudicialPeople = this.taskService.getTaskName();

  //   // const findJudicialPeople = this.findPersonService.find({searchTerm, userRole: this.domain, services: this.services, userIncluded: this.userIncluded, assignedUser: this.assignedUser});
  //   const findCaseworkersOrAdmins = this.findPersonService.findCaseworkers({searchTerm, userRole: this.domain, services: this.services, userIncluded: this.userIncluded, assignedUser: this.assignedUser});
  //   if (searchTerm && searchTerm.length > this.minSearchCharacters) {
  //     switch (this.domain) {
  //       case PersonRole.JUDICIAL: {
  //         return findJudicialPeople.pipe(map(persons => {
  //           const ids: string[] = this.selectedTaskNames.map(({id}) => id);
  //           return persons.filter(({ id }) => !ids.includes(id));
  //         }));
  //       }
  //       case PersonRole.ALL: {
  //         return zip(findJudicialPeople, findCaseworkersOrAdmins).pipe(map(separatePeople => separatePeople[0].concat(separatePeople[1])));
  //       }
  //       case PersonRole.CASEWORKER:
  //       case PersonRole.ADMIN: {
  //         return findCaseworkersOrAdmins;
  //       }
  //       default: {
  //         return of([]);
  //       }
  //     }
  //   }
  //   return of([]);
  // }

  public onSelectionChange(selectedTaskName: TaskNameModel): void {
    if (selectedTaskName && selectedTaskName.taskName) {
      const taskName = selectedTaskName.taskName;
      this.taskNameSelected.emit(taskName);
      this.findTaskNameControl.setValue(taskName);
    }
  }

  // public getDisplayName(selectedPerson: Person): string {
  //   if (!selectedPerson) {
  //     return '';
  //   }
  //   if (selectedPerson.domain === PersonRole.JUDICIAL && selectedPerson.knownAs) {
  //     return `${selectedPerson.knownAs} (${selectedPerson.email})`;
  //   }
  //   return selectedPerson.email ? `${selectedPerson.name} (${selectedPerson.email})` : selectedPerson.name;
  // }

  public onInput(): void {
    this.taskNameFieldChanged.emit();
  }
}
