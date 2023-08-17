import { UntypedFormGroup } from '@angular/forms';
import { GovUiConfigModel } from './gov-ui-config-model';

export interface RadioButtonsModel {
  key: string;
  group: UntypedFormGroup;
  config: GovUiConfigModel;
  errors: any;
  items: GovUiConfigModel[];
}

