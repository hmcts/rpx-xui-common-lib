import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FilterFieldConfig} from '../../models';
import {LocationByEPIMSModel} from '../../models/location.model';
import {getCheckBoxesValues} from '../generic-filter/generic-filter-utils';

@Component({
  selector: 'xuilib-find-location',
  templateUrl: './find-location.component.html',
  styleUrls: ['./find-location.component.scss']
})
export class FindLocationComponent implements OnInit {
  @Input() public selectedLocations: LocationByEPIMSModel[] = [];
  @Input() public submitted: boolean = true;
  @Input() public form: FormGroup;
  @Input() public field: FilterFieldConfig;
  @Input() public fields: FilterFieldConfig[];
  public locations: LocationByEPIMSModel[] = [];
  public locationsForm = new FormArray([]);
  public serviceIds: string = 'SSCS,IA';
  private pServices: string[] = [];

  public get services(): string[] {
    return this.pServices;
  }

  @Input()
  public set services(value: string[]) {
    this.pServices = value;
    const field = this.fields.find(f => f.name === this.field.findPersonField);
    if (field) {
      this.serviceIds = getCheckBoxesValues(field.options, value).filter(x => x !== 'services_all').join(',');
    }
  }

  private static initForm(selectedLocations: LocationByEPIMSModel[], formArray: FormArray): FormArray {
    for (const location of selectedLocations) {
      formArray.push(new FormControl(location));
    }
    return formArray;
  }

  public ngOnInit(): void {
    this.locationsForm = FindLocationComponent.initForm(this.selectedLocations, this.locationsForm);
  }

  public addSelection(): void {
    const locationsForm: FormArray = this.locationsForm;
    this.selectedLocations = this.locationsForm.value as LocationByEPIMSModel[];
    const formArray: FormArray = this.form.get(this.field.name) as FormArray;
    const lastSavedValue = this.selectedLocations[this.selectedLocations.length - 1];
    FindLocationComponent.initForm([lastSavedValue], formArray);
    locationsForm.at(this.selectedLocations.length - 1).setValue(null);
    this.locations = [];
  }

  public removeSelection(location: LocationByEPIMSModel): void {
    if (location.epims_id) {
      this.selectedLocations = this.selectedLocations.filter(selectedLocation => selectedLocation.epims_id !== location.epims_id);
      const formArray = this.form.get(this.field.name) as FormArray;
      const index = (formArray.value as LocationByEPIMSModel[]).findIndex(selectedLocation => selectedLocation.epims_id === location.epims_id);
      if (index > -1) {
        formArray.removeAt(index);
      }
    }
  }
}
