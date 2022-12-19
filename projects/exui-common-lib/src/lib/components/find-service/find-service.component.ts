import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FilterConfigOption, FilterFieldConfig } from '../../models';

@Component({
  selector: 'xuilib-find-service',
  templateUrl: './find-service.component.html',
  styleUrls: ['./find-service.component.scss']
})
export class FindServiceComponent implements OnInit {
  @Input() public field: FilterFieldConfig;
  @Input() public fields: FilterFieldConfig[];
  @Input() public serviceTitle: string;
  @Input() public form: FormGroup;
  @Input() public services: FilterConfigOption[] = [];
  @Input() public selectedServices: FilterConfigOption[] = [];
  @Input() public enableAddServiceButton: boolean = true;
  @Input() public disabled: boolean = false;

  @Output() public serviceFieldChanged = new EventEmitter<FilterConfigOption>();

  public tempSelectedService: FilterConfigOption = null;

  public ngOnInit(): void {
    this.selectedServices = this.selectedServices !== null ? this.selectedServices.filter((service: FilterConfigOption) => service.key) : [];
    this.SortAnOptions();
  }

  public addService(): void {
    if (this.tempSelectedService === null) {
      return;
    }
    this.selectedServices = [...this.selectedServices, this.tempSelectedService];
    this.addSelectedServicesToForm([this.tempSelectedService]);
    this.services = this.services.filter(s => s.key !== this.tempSelectedService.key);
    this.tempSelectedService = null;
    this.serviceFieldChanged.emit(this.tempSelectedService);
  }

  public removeService(service: FilterConfigOption): void {
    if (service.key) {
      this.selectedServices = this.selectedServices !== null ? this.selectedServices.filter((selectedService: FilterConfigOption) => selectedService.key !== service.key) : [];
      const formArray = this.form.get(this.field.name) as FormArray;
      const index = (formArray.value).findIndex((selectedService: FilterConfigOption) => selectedService.key === service.key);
      if (index > -1) {
        formArray.removeAt(index);
        this.services.splice(index, 0, service);
        this.SortAnOptions();
      }
      this.serviceFieldChanged.emit(service);
    }
  }

  public onServiceSelected(service: FilterConfigOption): void {
    if (!service) {
      this.tempSelectedService = null;
      this.serviceFieldChanged.emit(service);
      return;
    }
    if (this.field.maxSelected === 1) {
      this.removeSelectedValues();
      this.addSelectedServicesToForm([service]);
    } else {
      if (!this.selectedServices.find(s => s.key === service.key)) {
        if (service.key) {
          this.tempSelectedService = service;
        }
      }
    }
    this.serviceFieldChanged.emit(service);
  }

  private removeSelectedValues(): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    for (let i = 0; i < formArray.length; i++) {
      formArray.removeAt(i);
    }
    this.selectedServices = [];
  }

  private addSelectedServicesToForm(services: FilterConfigOption[]): void {
    const formArray = this.form.get(this.field.name) as FormArray;
    for (const service of services) {
      formArray.push(new FormControl(service));
    }
  }


  private SortAnOptions(): FilterConfigOption[] {
    return this.services.sort((a, b) => {
      return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : (b.label.toLowerCase() > a.label.toLowerCase() ? -1 : 0);
    });
  }


}
