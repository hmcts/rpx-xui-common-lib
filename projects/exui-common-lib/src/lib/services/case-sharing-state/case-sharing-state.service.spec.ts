import { TestBed } from '@angular/core/testing';

import { CaseSharingStateService } from './case-sharing-state.service';
import {SharedCase} from "../../models/case-share.model";
import {UserDetails} from "../../models/user-details.model";

describe('CaseSharingStateService', () => {
  let service: CaseSharingStateService;
  let sharedCases: SharedCase[] =[];
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(CaseSharingStateService);
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
    expect(service).toBeTruthy();
  });

  it('should request share', () => {
    sharedCases  = [{
      caseId: '9417373995765133',
      sharedWith: [],
      caseTitle: 'Sam Green Vs Williams Lee'
    }];
    let user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    service.setCases(sharedCases);
    let newSharedCase: SharedCase[] = service.requestShare(user);
    expect(newSharedCase[0].pendingShares.length==1).toBeTruthy();

  });

  it('should request un share', () => {
    sharedCases  = [{
      caseId: '9417373995765133',
      sharedWith: [],
      caseTitle: 'Sam Green Vs Williams Lee'
    }];
    let user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    service.setCases(sharedCases);
    service.requestUnshare('9417373995765133', user);
    expect(service).toBeTruthy();
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
    let user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    service.setCases(sharedCases);
    service.requestCancel('9417373995765133', user);
    expect(service).toBeTruthy();
  });


  it('should remove a case', () => {
    sharedCases  = [{
      caseId: '9417373995765133',
      sharedWith: [],
      caseTitle: 'Sam Green Vs Williams Lee'
    }];

    service.setCases(sharedCases);
    service.removeCase('9417373995765133');
    expect(service.getCases().length==0).toBeTruthy();
  });
});
