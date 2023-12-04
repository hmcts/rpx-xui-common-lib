import { AccessTypeModel } from './access-type.model';

export interface UserDetails {
  caseRoles?: string;
  email: string;
  firstName: string;
  idamId: string;
  lastName: string;
  lastUpdated: Date;
  accessTypes: AccessTypeModel[];
}
