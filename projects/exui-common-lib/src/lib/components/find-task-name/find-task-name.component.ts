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
  @Output() public taskNameSelected = new EventEmitter<any>();
  @Output() public taskNameFieldChanged = new EventEmitter<void>();
  @Input() public title: string;
  @Input() public boldTitle = 'Find the task name';
  @Input() public subTitle = 'Type the name of the task name and select them.';
  @Input() public domain = PersonRole.ALL;
  @Input() public findTaskNameGroup: FormGroup = new FormGroup({});
  @Input() public selectedTaskName: string;
  @Input() public submitted: boolean = true;
  @Input() public assignedUser?: string;
  @Input() public placeholderContent: string = '';
  @Input() public isNoResultsShown: boolean = true;
  @Input() public showUpdatedColor: boolean = false;
  @Input() public selectedTaskNames: TaskNameModel[] = [];
  @Input() public errorMessage: string = 'You must select a name';
  @Input() public idValue: string = '';
  @Input() public services: string = 'IA';
  @Input() public disabled: boolean = null;
  public showAutocomplete: boolean = false;
  public findTaskNameControl: FormControl;
  public filteredOptions: any[] = [];
  public readonly minSearchCharacters = 1;
  private sub: Subscription;
  public searchTerm: string = '';

  constructor(private readonly cd: ChangeDetectorRef, private readonly taskService: TaskNameService) {}

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
      debounceTime(300),
      tap((searchTerm) => this.searchTerm = searchTerm),
      tap((searchTerm) => typeof searchTerm === 'string' ? this.taskNameSelected.emit('null') : void 0),
      filter((searchTerm: string) => searchTerm && searchTerm.length >= this.minSearchCharacters),
      mergeMap(() => this.getTaskName()),
    ).subscribe((taskNameModel: TaskNameModel[]) => {
      this.filteredOptions = taskNameModel ? taskNameModel : [];
      if (this.searchTerm) {
        this.filteredOptions = this.filteredOptions.filter((taskType) => taskType.task_type.task_type_name.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase())).map(taskType=> taskType);
      }
      this.cd.detectChanges();
    });
  }

  public getTaskName(): Observable<TaskNameModel[]> {
    return this.taskService.getTaskName(this.services);
  }

  public onSelectionChange(selectedTaskTypeName: any): void {
    if (selectedTaskTypeName) {
      this.taskNameSelected.emit(selectedTaskTypeName);
      this.findTaskNameControl.setValue(this.getTaskTypeName(selectedTaskTypeName), {emitEvent: false, onlySelf: true});
    }
  }

  public getTaskTypeName(selectedTaskType: any): string {
    if (!selectedTaskType) {
      return '';
    }
    return selectedTaskType.task_type.task_type_name;
  }

  public onInput(): void {
    this.taskNameFieldChanged.emit();
  }
}
