import { PersonRole } from './person.model';

export interface SearchOptions {
  searchTerm: string;
  userRole: PersonRole;
  services: string[];
  userIncluded?: boolean;
  assignedUser?: string;
}
