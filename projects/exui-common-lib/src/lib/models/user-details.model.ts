import { UserAccessType } from './user-access-type.model';

export interface UserDetails {
  caseRoles?: string;
  email: string;
  firstName: string;
  idamId: string;
  lastName: string;
  userAccessTypes?: UserAccessType[];
}
