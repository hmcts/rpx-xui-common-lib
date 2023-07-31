import { TestBed } from '@angular/core/testing';

import {SharedCase} from '../../models/case-share.model';
import {UserDetails} from '../../models/user-details.model';
import { CaseSharingStateService } from './case-sharing-state.service';

describe('CaseSharingStateService', () => {
  let service: CaseSharingStateService;
  let sharedCases: SharedCase[] = [];
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.inject(CaseSharingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

  });

  it('should set cases', () => {
    sharedCases  = [{
      caseId: '9417373995765133',
      sharedWith: [],
      caseTitle: 'Sam Green Vs Williams Lee'
    }];
    service.setCases(sharedCases);
    let allCases: SharedCase[] = [];
    service.state.subscribe(shareCases => allCases = shareCases);
    expect(allCases.length).toBe(1);
  });

  it('should request share', () => {
    sharedCases  = [{
      caseId: '9417373995765133',
      sharedWith: [],
      caseTitle: 'Sam Green Vs Williams Lee'
    }];
    const user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    service.setCases(sharedCases);
    const newSharedCase: SharedCase[] = service.requestShare(user);
    expect(newSharedCase[0].pendingShares.length).toBe(1);
  });

  it('should request unshare', () => {
    const user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    sharedCases = [
      {
        caseId: '9417373995765133',
        sharedWith: [user],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    service.setCases(sharedCases);
    service.requestUnshare(user, '9417373995765133');
    let allCases: SharedCase[] = [];
    service.state.subscribe(shareCases => allCases = shareCases);

    expect(allCases[0].pendingUnshares.length).toBe(1);
  });

  it('should request unshare from all cases', () => {
    const user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    sharedCases = [
      {
        caseId: '9417373995765133',
        sharedWith: [user],
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '9417373995765134',
        sharedWith: [user],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    service.setCases(sharedCases);
    service.requestUnshare(user);
    let allCases: SharedCase[] = [];
    service.state.subscribe(shareCases => allCases = shareCases);

    expect(allCases[0].pendingUnshares.length).toBe(1);
    expect(allCases[1].pendingUnshares.length).toBe(1);
  });

  it('should undo pending share for a new user', () => {
    const user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    const user2: UserDetails = {
      idamId : 'pus111112',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus2@test.com'
    };
    sharedCases = [
      {
        caseId: '9417373995765133',
        pendingShares: [user],
        pendingUnshares: [user2],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    service.setCases(sharedCases);
    service.requestUnshare(user, '9417373995765133');
    let allCases: SharedCase[] = [];
    service.state.subscribe(shareCases => allCases = shareCases);

    expect(allCases[0].pendingShares.length).toBe(0);
    expect(allCases[0].pendingUnshares.length).toBe(1);
  });

  it('should undo all pending shares for a new user', () => {
    const user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    const user2: UserDetails = {
      idamId : 'pus111112',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus2@test.com'
    };
    sharedCases = [
      {
        caseId: '9417373995765133',
        pendingShares: [user],
        pendingUnshares: [user2],
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '9417373995765134',
        pendingShares: [user],
        pendingUnshares: [user2],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    service.setCases(sharedCases);
    service.requestUnshare(user);
    let allCases: SharedCase[] = [];
    service.state.subscribe(shareCases => allCases = shareCases);

    expect(allCases[0].pendingShares.length).toBe(0);
    expect(allCases[0].pendingUnshares.length).toBe(1);
    expect(allCases[1].pendingShares.length).toBe(0);
    expect(allCases[1].pendingUnshares.length).toBe(1);
  });

  it('should cancel a user', () => {
    sharedCases  = [{
      caseId: '9417373995765133',
      sharedWith: [],
      caseTitle: 'Sam Green Vs Williams Lee',
      pendingUnshares: [{
        idamId: 'pus111111',
        firstName: 'JamesPUS',
        lastName: 'PriestPUS',
        email: 'jamespus.priestpus@test.com'
      }]
    }];
    const user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    service.setCases(sharedCases);
    service.requestCancel('9417373995765133', user);
    let allCases: SharedCase[] = [];
    service.state.subscribe(shareCases => allCases = shareCases);
    expect(allCases[0].pendingUnshares.length).toBe(0);
  });


  it('should remove a case when multiple shared cases exists', () => {
    sharedCases  = [
      {
        caseId: '9417373995765133',
        sharedWith: [],
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '7898764567832340',
        sharedWith: [],
        caseTitle: 'James vs Jane'
      }
    ];

    service.setCases(sharedCases);
    service.removeCase('9417373995765133');
    expect(service.getCases().length).toBe(1);
  });

  it('should not remove a case when only one shared case exists', () => {
    sharedCases  = [
      {
        caseId: '9417373995765133',
        sharedWith: [],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];

    service.setCases(sharedCases);
    service.removeCase('9417373995765133');
    expect(service.getCases().length).toBe(1);
  });
});
