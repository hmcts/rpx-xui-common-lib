


import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FilterConfigOption, FilterFieldConfig } from '../../models';
import { SearchServiceComponent } from '../search-service/search-service.component';

@Component({
  selector: 'xuilib-find-service',
  templateUrl: './find-service.component.html',
  styleUrls: ['./find-service.component.scss']
})
export class FindServiceComponent implements OnInit, OnDestroy {
  @Input() public field: FilterFieldConfig;
  @Input() public serviceTitle: string;
  @Input() public form: FormGroup;
  @Input() public disabled: boolean = false;
  @Input() public formSubmissionEvent$: Subject<void>;
  @ViewChild(SearchServiceComponent, { static: true }) public searchServiceComponent: SearchServiceComponent;
  @Output() public serviceFieldChanged = new EventEmitter();
  private isSelectedAll = false;
  private formSubmissionEventSubscription: Subscription;

  public tempSelectedService: FilterConfigOption = null;
  public get selectedServices(): FilterConfigOption[] {
    const selectAllValue = this.field.options.find(item => item.selectAll);
    return this.isSelectedAll ? [selectAllValue] : this.form.get(this.field.name)?.value;
  }

  public ngOnInit(): void {
    this.sortOptionsAlphabetically();

    // Patch Default Option
    if (this.field.defaultOption) {
      this.addOption(this.field.defaultOption);
    }
    if (this.formSubmissionEvent$) {
      this.formSubmissionEventSubscription = this.formSubmissionEvent$.subscribe(() => {
        this.searchServiceComponent.resetSearchTerm();
      });
    }
  }

  public addOption(option: FilterConfigOption): void {
    if (option) {
      if (option.selectAll) {
        this.isSelectedAll = true;
        this.removeAllSelectedValues();
        this.field.options.forEach(item => {
          if (!item.selectAll) {
            this.addSelectedServiceToForm(item);
          }
        });
      } else {
        if (this.isSelectedAll) {
          this.removeAllSelectedValues();
          this.isSelectedAll = false;
        }
        this.addSelectedServiceToForm(option);
      }

      this.tempSelectedService = null;
      this.serviceFieldChanged.emit();
      this.searchServiceComponent.resetSearchTerm();
    }
  }

  public removeOption(service: FilterConfigOption): void {
    if (service.selectAll) {
      this.removeAllSelectedValues();
      this.isSelectedAll = false;
    } else if (service.key) {
      const formArray = this.form.get(this.field.name) as FormArray;
      const index = (formArray.value).findIndex((selectedService: FilterConfigOption) => selectedService.key.toLowerCase() === service.key.toLowerCase());
      if (index > -1) {
        formArray.removeAt(index);
      }
      this.serviceFieldChanged.emit();
    }
  }

  public onOptionSelected(option: FilterConfigOption): void {
    if (!this.field.enableAddButton && this.field.maxSelected === 1) {
      this.removeAllSelectedValues();
      this.addSelectedServiceToForm(option);
      this.serviceFieldChanged.emit();
    } else {
      this.tempSelectedService = option;
    }
  }

  private removeAllSelectedValues(): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    formArray.clear();
  }

  private addSelectedServiceToForm(service: FilterConfigOption): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    formArray.push(new FormControl(service));
  }

  private sortOptionsAlphabetically(): FilterConfigOption[] {
    return this.field.options.sort((a, b) => {
      return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : (b.label.toLowerCase() > a.label.toLowerCase() ? -1 : 0);
    });
  }

  public ngOnDestroy() {
    this.formSubmissionEventSubscription?.unsubscribe();
  }
}
