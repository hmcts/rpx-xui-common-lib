import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, mergeMap, tap } from 'rxjs/operators';
import { TaskNameModel } from '../../models/task-name.model';
import { TaskNameService } from '../../services/task-name/task-name.service';

@Component({
  selector: 'exui-search-task-name',
  templateUrl: './search-task-name.component.html',
  styleUrls: ['./search-task-name.component.scss']
})
export class SearchTaskNameComponent implements OnInit {
  @Input() public control: AbstractControl;
  @Input() public disabled: boolean = null;
  @Input() public singleMode: boolean = false;
  @Input() public taskNameType: string = '';
  @Input() public serviceIds: string = '';
  @Input() public submitted?: boolean = true;
  @Input() public delay?: number = 500;
  @Input() public form: FormGroup;
  @Input() public showAutocomplete: boolean = false;
  @Input() public taskNames: any[] = [];
  @Output() public taskNameSelected = new EventEmitter<TaskNameModel>();
  @Output() public taskNameInputChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() public searchTaskNameChanged: EventEmitter<void> = new EventEmitter<void>();
  public readonly minSearchCharacters = 1;
  public term: string = '';
  private pSelectedTaskNames: any[] = [];
  private pReset: boolean = true;

  constructor(private readonly taskNameService: TaskNameService, private readonly fb: FormBuilder, private readonly cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      searchTerm: ['']
    });
  }

  public get reset(): boolean {
    return this.pReset;
  }

  @Input()
  public set reset(value: boolean) {
    this.pReset = value;
    this.resetSearchTerm();
  }

  public get selectedTaskNames(): any[] {
    return this.pSelectedTaskNames;
  }

  @Input()
  public set selectedTaskNames(value: any[]) {
    this.pSelectedTaskNames = value;

  }

  public ngOnInit(): void {
    if (this.singleMode && this.selectedTaskNames.length > 0) {
      const taskName = this.selectedTaskNames[0];
      this.form.controls.searchTerm.patchValue(taskName.taskName, {emitEvent: false, onlySelf: true});
    }
    this.search();
  }

  public filter(): void {
    this.getTaskName().pipe(
      map((taskName) => this.removeSelectedTaskNames(taskName)
      )
    );
  }

  public onSelectionChange(taskName: any): void {
    this.form.controls.searchTerm.patchValue(taskName.taskName, {emitEvent: false, onlySelf: true});
    this.taskNameSelected.emit(taskName);
  }

  public search(): void {
    this.form.controls.searchTerm.valueChanges
      .pipe(
        tap((term) => this.taskNameInputChanged.next(term)),
        tap(() => this.taskNames = []),
        tap((term) => this.term = term),
        filter(term => !!term && term.length >= this.minSearchCharacters),
        debounceTime(this.delay),
        mergeMap(() => this.getTaskName()),
        map((taskNames) => this.removeSelectedTaskNames(taskNames))
      ).subscribe(taskNames => {
      this.taskNames = taskNames;
      if (this.term) {
        this.taskNames = this.taskNames.filter((t) => t.taskName.toLocaleLowerCase().includes(this.term.toLocaleLowerCase()));
      }
      this.cd.markForCheck();
      if (taskNames.length === 1 && this.term === taskNames[0].taskName && !this.singleMode) {
        this.taskNameSelected.emit(taskNames[0]);
        this.showAutocomplete = false;
        return;
      }
      this.showAutocomplete = true;
    });
  }

  public onInput(): void {
    this.searchTaskNameChanged.emit();
  }

  public getTaskName(): Observable<any[]> {
      return this.taskNameService.getTaskName();  
  }

  public resetSearchTerm(): void {
    this.form.controls.searchTerm.patchValue('', {emitEvent: false, onlySelf: true});
  }

  private removeSelectedTaskNames(taskNames: any[]): any[] {
    if (this.singleMode) {
      return taskNames;
    }
    return taskNames.filter(
      taskName => !this.selectedTaskNames.map(selectedTaskName => selectedTaskName.taskName).includes(taskName.taskName)
    );
  }
}
