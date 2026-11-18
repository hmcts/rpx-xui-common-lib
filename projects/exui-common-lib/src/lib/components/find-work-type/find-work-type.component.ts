import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FilterFieldConfig, WorkType } from '../../models';
import { getValues } from '../generic-filter/generic-filter-utils';
import { SearchWorkTypeComponent } from '../search-work-type/search-work-type.component';

@Component({
  selector: 'xuilib-find-work-type',
  templateUrl: './find-work-type.component.html',
  styleUrls: ['./find-work-type.component.scss'],
  standalone: false
})
export class FindWorkTypeComponent implements OnInit, OnDestroy {
  @Output() public workTypeFieldChanged = new EventEmitter<void>();
  @Input() public submitted: boolean = true;
  @Input() public enableAddWorkTypeButton: boolean = true;
  @Input() public form: FormGroup;
  @Input() public field: FilterFieldConfig;
  @Input() public fields: FilterFieldConfig[];
  @Input() public workTypeTitle = 'Search for a work type by name';
  @Input() public disableInputField = false;
  @Input() public formSubmissionEvent$: Subject<void>;
  public tempSelectedWorkType: WorkType = null;
  public serviceIds: string = 'SSCS,IA';
  @ViewChild(SearchWorkTypeComponent, { static: true }) public searchWorkTypeComponent: SearchWorkTypeComponent;
  private pServices: string[] = [];
  private pDisabled: boolean = false;
  private formSubmissionEventSubscription: Subscription;

  public get disabled(): boolean {
    return this.pDisabled;
  }

  @Input()
  public set disabled(value: boolean) {
    if (value) {
      this.searchWorkTypeComponent.resetSearchTerm();
      this.removeSelectedValues();
    }
    this.pDisabled = this.disableInputField === true ? true : null;
  }

  public get services(): string[] {
    return this.pServices;
  }

  // Currently not used - but kept for potential future proofing
  @Input()
  public set services(value: string[]) {
    this.pServices = value;
    const field = this.fields.find(f => {
      if (this.field) {
        return f.name === this.field.findLocationField;
      }
    });

    if (field) {
      if (typeof value === 'string') {
        this.serviceIds = value;
      } else {
        this.serviceIds = getValues(field.options, value).filter(service => service !== 'services_all').join(',');
      }
    }
  }

  public get selectedWorkTypes() {
    return (this.form.get(this.field.name)?.value as WorkType[])?.filter(workType => workType?.key);
  }

  public ngOnInit(): void {
    if (this.formSubmissionEvent$) {
      this.formSubmissionEventSubscription = this.formSubmissionEvent$.subscribe(() => {
        // Shouldn't reset search term if single mode and already has selected
        const oneSelectedAndMaxSelectedOne = this.selectedWorkTypes?.length === 1 && this.field.maxSelected === 1;
        if (!oneSelectedAndMaxSelectedOne) {
          this.searchWorkTypeComponent.resetSearchTerm();
        }
      });
    }
  }

  public addWorkType(): void {
    if (this.tempSelectedWorkType) {
      this.addSelectedWorkTypesToForm([this.tempSelectedWorkType]);
      this.tempSelectedWorkType = null;
      this.searchWorkTypeComponent.resetSearchTerm();
    }
  }

  public removeWorkType(workType: WorkType): void {
    if (workType.key) {
      const formArray = this.form.get(this.field.name) as FormArray;
      const index = (formArray.value as WorkType[]).findIndex(selectedWorkType => selectedWorkType.key === workType.key);
      if (index > -1) {
        formArray.removeAt(index);
      }
    }
  }

  public onInputChanged(term: string): void {
    // if the filter is in single mode clear the selected locations
    if (typeof term === 'string' && this.field.maxSelected === 1) {
      this.removeSelectedValues();
    }
  }

  public onSearchInputChanged(): void {
    this.workTypeFieldChanged.emit();
  }

  public onWorkTypeSelected(workType: WorkType): void {
    if (this.field.maxSelected === 1) {
      this.removeSelectedValues();
      this.addSelectedWorkTypesToForm([workType]);
    } else {
      if (!this.selectedWorkTypes.find(x => x.key === workType.key)) {
        if (workType.key) {
          this.tempSelectedWorkType = workType;
        }
      }
    }
  }

  private removeSelectedValues(): void {
    const formArray = this.form.get(this.field?.name) as FormArray;
    if (formArray) {
      for (let i = 0; i < formArray.length; i++) {
        formArray.removeAt(i);
      }
    }
  }

  private addSelectedWorkTypesToForm(workTypes: WorkType[]): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    for (const workType of workTypes) {
      formArray.push(new FormControl(workType));
    }
  }

  public ngOnDestroy() {
    this.formSubmissionEventSubscription?.unsubscribe();
  }
}
