import { PersonDomain } from './person.model';

export interface SearchOptions {
  searchTerm: string;
  jurisdiction: PersonDomain;
}
