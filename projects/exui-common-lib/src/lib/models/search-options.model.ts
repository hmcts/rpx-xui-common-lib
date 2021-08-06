import { PersonRole } from './person.model';

export interface SearchOptions {
  searchTerm: string;
  jurisdiction: PersonRole;
}
