import { UserDetails } from './user-details.model';

export interface SharedCase {
  caseId: string;
  caseTitle: string;
  caseTypeId?: string;
  roles?: string[];
  sharedWith?: UserDetails[];
  pendingShares?: UserDetails[];
  pendingUnshares?: UserDetails[];
}

export enum SharedCaseErrorMessages {
  OneCaseMustBeSelected = 'At least one case must be selected',
  NoChangesRequested = 'You have not requested any changes to case sharing',
  OnePersonMustBeAssigned = 'At least one person must be assigned to each case'
}
