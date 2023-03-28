import { RefDataLocation } from '../../models/ref-data-location.model';

export interface RefDataLocationsByServiceCodeResponse {
  court_type: string;
  court_type_id: string;
  court_venues: RefDataLocation[];
  service_code: string;
  welsh_court_type: string;
}
