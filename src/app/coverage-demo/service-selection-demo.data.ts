import { FilterConfigOption } from 'projects/exui-common-lib/src/public-api';

export const serviceOptions: FilterConfigOption[] = [
  { key: 'family', label: 'Family' },
  { key: 'civil-enforcement', label: 'Civil enforcement' },
  { key: 'all', label: 'All services', selectAll: true },
  { key: 'civil-damages', label: 'Civil damages' }
];
