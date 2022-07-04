import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FilterFieldConfig} from '../../models';
import { TaskNameModel } from '../../models/task-name.model';
import {getValues} from '../generic-filter/generic-filter-utils';
import { SearchTaskNameComponent } from '../search-task-name/search-task-name.component';

@Component({
  selector: 'xuilib-find-task-name',
  templateUrl: './find-task-name.component.html',
  styleUrls: ['./find-task-name.component.scss']
})

export class FindTaskNameComponent {
  @Output() public taskNameFieldChanged = new EventEmitter<void>();
  @Input() public selectedTaskNames: TaskNameModel[] = [];
  @Input() public submitted: boolean = true;
  @Input() public enableAddTaskNameButton: boolean = true;
  @Input() public form: FormGroup;
  @Input() public field: FilterFieldConfig;
  @Input() public fields: FilterFieldConfig[];
  @Input() public taskNameTitle = 'Search for a task by name';
  @Input() public disableInputField = false;
  public taskNames: TaskNameModel[] = [];
  public tempSelectedTaskName: TaskNameModel = null;
  public serviceIds: string = 'SSCS,IA';
  @ViewChild(SearchTaskNameComponent) public searchTaskNameComponent: SearchTaskNameComponent;
  private pServices: string[] = [];
  private pDisabled: boolean = false;

  public get disabled(): boolean {
    return this.pDisabled;
  }

  @Input()
  public set disabled(value: boolean) {
    if (value) {
      this.searchTaskNameComponent.resetSearchTerm();
      this.removeSelectedValues();
    }
    this.pDisabled = this.disableInputField === true ? true : null;
  }

  public get services(): string[] {
    return this.pServices;
  }

  @Input()
  public set services(value: string[]) {
    this.pServices = value;
    const field = this.fields.find(f => f.name === this.field.findLocationField);
    if (field) {
      if (typeof value === 'string') {
        this.serviceIds = value;
      } else {
        this.serviceIds = getValues(field.options, value).filter(x => x !== 'services_all').join(',');
      }
    }
  }

  public addTaskName(): void {
    if (this.tempSelectedTaskName) {
      this.selectedTaskNames = [...this.selectedTaskNames, this.tempSelectedTaskName];
      this.addSelectedTaskNamesToForm([this.tempSelectedTaskName]);
      this.tempSelectedTaskName = null;
      this.taskNames = [];
      this.searchTaskNameComponent.resetSearchTerm();
    }
  }

  public removeTaskName(taskName: TaskNameModel): void {
    if (taskName.taskName) {
      this.selectedTaskNames = this.selectedTaskNames.filter(selectedTaskName => selectedTaskName.taskName !== taskName.taskName);
      const formArray = this.form.get(this.field.name) as FormArray;
      const index = (formArray.value as TaskNameModel[]).findIndex(selectedTaskName => selectedTaskName.taskName === taskName.taskName);
      if (index > -1) {
        formArray.removeAt(index);
      }
    }
  }

  public onInputChanged(term: string): void {
    // if the filter is in single mode clear the selected taskNames
    if (typeof term === 'string' && this.field.maxSelected === 1) {
        this.removeSelectedValues();
    }
  }

  public onSearchInputChanged(): void {
    this.taskNameFieldChanged.emit();
  }

  public onTaskNameSelected(taskName: any): void {
    if (this.field.maxSelected === 1) {
      this.removeSelectedValues();
      this.addSelectedTaskNamesToForm([taskName]);
    } else {
      if (!this.selectedTaskNames.find(x => x.taskName === taskName.taskName)) {
        if (taskName.taskName) {
          this.tempSelectedTaskName = taskName;
        }
      }
    }
  }

  private removeSelectedValues(): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    for (let i = 0; i < formArray.length; i++) {
      formArray.removeAt(i);
    }
    this.selectedTaskNames = [];
  }

  private addSelectedTaskNamesToForm(taskNames: any[]): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    for (const taskName of taskNames) {
      formArray.push(new FormControl(taskName));
    }
  }

}
