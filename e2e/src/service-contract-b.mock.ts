import type { LocationByEPIMMSModel, RefDataHMCTSService, RefDataRegion, WorkType } from '../../projects/exui-common-lib/src/public-api';
import type { TaskNameModel } from '../../projects/exui-common-lib/src/lib/models/task-name.model';

export const serviceContractBRegions: RefDataRegion[] = [
  { region_id: '1', description: 'London' },
  { region_id: '2', description: 'North West' }
];

export const serviceContractBServices: RefDataHMCTSService[] = [{
  jurisdiction: 'Civil',
  service_id: 1,
  org_unit: 'Civil Courts',
  business_area: 'Civil',
  sub_business_area: 'Money claims',
  service_code: 'CIVIL',
  service_description: 'Civil service',
  service_short_description: 'Civil',
  ccd_service_name: 'CIVIL',
  last_update: '2026-10-20',
  ccd_case_types: ['MoneyClaim']
}];

export const serviceContractBLocations: LocationByEPIMMSModel[] = [{
  epimms_id: 'loc-london',
  site_name: 'London Civil Centre',
  court_name: 'LONDON CIVIL CENTRE',
  region_id: '1',
  region: 'London',
  postcode: 'WC2A 1AA'
}];

export const serviceContractBSecondLocations: LocationByEPIMMSModel[] = [{
  epimms_id: 'loc-manchester',
  site_name: 'Manchester Civil Centre',
  court_name: 'MANCHESTER CIVIL CENTRE',
  region_id: '2',
  region: 'North West',
  postcode: 'M60 9DJ'
}];

export const serviceContractBFirstTaskNames: TaskNameModel[] = [
  { taskId: 101, taskName: 'Review bundle' }
];

export const serviceContractBSecondTaskNames: TaskNameModel[] = [
  { taskId: 202, taskName: 'Create order' }
];

export const serviceContractBWorkTypes: WorkType[] = [
  { key: 'review', label: 'Review case' }
];
