import { FormGroup } from '@angular/forms';
import { GovUiConfigModel } from './gov-ui-config-model';

export interface RadioButtonsModel {
  key: string;
  group: FormGroup;
  config: GovUiConfigModel;
  errors: any;
  items: GovUiConfigModel[];
}

