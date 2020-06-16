import { TestBed } from '@angular/core/testing';

import { CaseSharingStateService } from './case-sharing-state.service';

describe('CaseSharingStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaseSharingStateService = TestBed.get(CaseSharingStateService);
    expect(service).toBeTruthy();
  });
});
