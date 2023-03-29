import { LocationModel } from '../../../../models';

export interface LocationModelsByServiceCodeResponse {
  court_type: string;
  court_type_id: string;
  court_venues: LocationModel[];
  service_code: string;
  welsh_court_type: string;
}
