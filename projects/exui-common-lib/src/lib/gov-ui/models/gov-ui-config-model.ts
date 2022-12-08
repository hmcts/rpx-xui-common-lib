export interface GovUiConfigModel {
  id: string;
  value?: string;
  label?: string;
  hint?: string;
  name?: string;
  focusOn?: string;
  classes?: string;
  legend?: string;
  key?: string;
  type?: string;
  isPageHeading?: boolean;
  rows?: number;
  fullWidth?: boolean;
  optional?: boolean;
}
