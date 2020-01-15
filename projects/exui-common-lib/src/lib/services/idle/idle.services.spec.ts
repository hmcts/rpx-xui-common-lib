import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Idle} from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { of } from 'rxjs';
import { IdleConfigModel} from '../../models/idle-config.model';
import { IdleService } from './idle.services';

describe('Idle Services', () => {

  const mockIdle = jasmine.createSpyObj('Idle', [
    'setIdleName',
    'setTimeout',
    'setInterrupts',
    'setIdle',
    'watch'
  ]);

  mockIdle.onIdleEnd = { pipe: () => of('something') };
  mockIdle.onTimeout = of('something');
  mockIdle.onIdleStart = of('something');
  mockIdle.onTimeoutWarning = { pipe: () => of('something') };

  const mockKeepAlive = jasmine.createSpyObj('KeepInterval', [
    'interval'
  ]);

  mockKeepAlive.onPing = { pipe: () => of('something') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: Idle, useValue: mockIdle },
        { provide: Keepalive, useValue: mockKeepAlive },
        IdleService,
      ]
    });
  });


  describe('init', () => {
    it('should setup values', inject([IdleService], (service: IdleService) => {
      const idleConfig: IdleConfigModel = {
        timeout: 10 * 60, // 10 min
        idleMilliseconds: 3000,
        keepAliveInSeconds: 5 * 60 * 60, // 5 hrs
        idleServiceName: 'idleSession'
      };
      service.init(idleConfig);
      expect(mockIdle.setIdleName).toHaveBeenCalledWith('idleSession');
      expect(mockIdle.setTimeout).toHaveBeenCalled();
    }));
  });

});
