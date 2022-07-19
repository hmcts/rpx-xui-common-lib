import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
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

export class FindTaskNameComponent implements OnChanges, OnDestroy {
  @Output() public taskNameSelected = new EventEmitter<any>();
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
  public filteredOptions: string[] = [];
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

  public ngOnChanges(): void {
    this.findTaskNameControl = new FormControl(this.selectedTaskName);
    this.findTaskNameGroup.addControl('findTaskNameControl', this.findTaskNameControl);
    this.sub = this.findTaskNameControl.valueChanges
    .pipe(
      tap(() => this.showAutocomplete = false),
      tap(() => this.filteredOptions = []),
      tap((term) => this.searchTerm = term),
      debounceTime(300),
      tap((searchTerm) => {
        if (!searchTerm) {
          this.taskNameSelected.emit('');
        }
        return searchTerm;
      }),
      // tap((searchTerm) => typeof searchTerm === 'string' ? this.taskNameSelected.emit('null') : void 0),
      filter((searchTerm: string) => searchTerm && searchTerm.length >= this.minSearchCharacters),
      mergeMap(() => this.getTaskName()),
    ).subscribe((taskNameModel: TaskNameModel[]) => {
      this.filteredOptions = taskNameModel.map(task => task.taskName);
      if (this.searchTerm) {
        this.filteredOptions = this.filteredOptions.filter((taskName) => taskName.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase())).map(taskName => taskName);
      }
      this.cd.detectChanges();
    });
  }

  public getTaskName(): Observable<any[]> {
    return this.taskService.getTaskName();
  }



  public onSelectionChange(selectedTaskName: TaskNameModel): void {
    if (selectedTaskName) {
      this.taskNameSelected.emit(selectedTaskName);
      this.findTaskNameControl.setValue(selectedTaskName);
    }
  }

  public onInput(): void {
    this.taskNameFieldChanged.emit();
  }
}
