import type { Page } from '@playwright/test';
import type { LocationByEPIMMSModel, WorkType } from '../../projects/exui-common-lib/src/public-api';

export interface TaskNameRecord {
  task_type: {
    task_type_id: string;
    task_type_name: string;
  };
}

export interface LookupRequestCounts {
  taskNames: number;
}

export const londonLocation: LocationByEPIMMSModel = {
  epimms_id: 'loc-london',
  site_name: 'Central London Hearing Centre',
  court_name: 'CENTRAL LONDON HEARING CENTRE',
  region_id: '1',
  region: 'London',
  postcode: 'WC2A 1AA'
};

export const manchesterLocation: LocationByEPIMMSModel = {
  epimms_id: 'loc-manchester',
  site_name: 'Manchester Civil Justice Centre',
  court_name: 'MANCHESTER CIVIL JUSTICE CENTRE',
  region_id: '2',
  region: 'North West',
  postcode: 'M60 9DJ'
};

export const leedsVenue: LocationByEPIMMSModel = {
  epimms_id: 'venue-leeds',
  site_name: 'Leeds Combined Court Centre',
  court_name: 'LEEDS COMBINED COURT CENTRE',
  region_id: '3',
  region: 'North East',
  postcode: 'LS1 3BG'
};

export const selectedVenue: LocationByEPIMMSModel = {
  epimms_id: 'venue-selected',
  site_name: 'Selected Court',
  court_name: 'SELECTED COURT'
};

export const birminghamVenue: LocationByEPIMMSModel = {
  epimms_id: 'venue-birmingham',
  site_name: 'Birmingham Civil Justice Centre',
  court_name: 'BIRMINGHAM CIVIL JUSTICE CENTRE'
};

export const reviewWorkType: WorkType = { key: 'review', label: 'Review case' };
export const createWorkType: WorkType = { key: 'create', label: 'Create task' };

export const taskNames: TaskNameRecord[] = [
  {
    task_type: {
      task_type_id: 'review-hearing-bundle',
      task_type_name: 'Review Hearing bundle'
    }
  },
  {
    task_type: {
      task_type_id: 'create-order',
      task_type_name: 'Create order'
    }
  }
];

const locationResults: Record<string, LocationByEPIMMSModel[]> = {
  Centre: [londonLocation, manchesterLocation],
  London: [londonLocation],
  Manchester: [manchesterLocation],
  Nobody: []
};

const venueResults: Record<string, LocationByEPIMMSModel[]> = {
  Court: [
    selectedVenue,
    { ...selectedVenue, site_name: 'Duplicate selected court' },
    { epimms_id: 'venue-nameless', site_name: 'No court name' },
    birminghamVenue
  ],
  Leeds: [leedsVenue],
  Manchester: [manchesterLocation],
  Nobody: []
};

const workTypeResults: Record<string, WorkType[]> = {
  Create: [createWorkType],
  Review: [reviewWorkType],
  Task: [reviewWorkType, createWorkType],
  Nobody: []
};

export async function mockLookupHttp(page: Page): Promise<LookupRequestCounts> {
  const requests: LookupRequestCounts = { taskNames: 0 };

  await page.route('**/api/locations/getLocations', (route) => {
    const term = route.request().postDataJSON().searchTerm as string;
    return route.fulfill({ json: locationResults[term] ?? [] });
  });
  await page.route('**/api/prd/location/getLocations?*', (route) => {
    const term = new URL(route.request().url()).searchParams.get('searchTerm') ?? '';
    return route.fulfill({ json: venueResults[term] ?? [] });
  });
  await page.route('**/workallocation/task/search-types-of-work', (route) => {
    const term = route.request().postDataJSON().searchTerm as string;
    return route.fulfill({ json: workTypeResults[term] ?? [] });
  });
  await page.route('**/workallocation/taskNames', (route) => {
    requests.taskNames += 1;
    return route.fulfill({ json: taskNames });
  });

  return requests;
}
