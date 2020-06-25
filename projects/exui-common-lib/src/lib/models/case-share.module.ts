import { UserDetails } from './user-details.module';

export interface SharedCase {
  caseId: string;
  caseTitle: string;
  roles?: string[];
  sharedWith?: UserDetails[];
  pendingShares?: UserDetails[];
  pendingUnshares?: UserDetails[];
}
