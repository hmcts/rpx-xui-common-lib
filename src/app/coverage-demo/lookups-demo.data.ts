import { FilterFieldConfig, LocationByEPIMMSModel } from 'projects/exui-common-lib/src/public-api';

export const createLocationField = (single: boolean): FilterFieldConfig => ({
  name: 'locations',
  options: [],
  minSelected: 0,
  maxSelected: single ? 1 : 0,
  type: 'find-location'
});

export const createWorkTypeField = (single: boolean): FilterFieldConfig => ({
  name: 'workTypes',
  options: [],
  minSelected: 0,
  maxSelected: single ? 1 : 0,
  type: 'find-work-type'
});

export const selectedVenue: LocationByEPIMMSModel = {
  epimms_id: 'venue-selected',
  site_name: 'Selected Court',
  court_name: 'SELECTED COURT'
};
