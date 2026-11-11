import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DocumentInterruptSource, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { IdleConfigModel } from '../../models/idle-config.model';
import { Subject, Subscription } from 'rxjs';
import { ManageSessionServices } from './manage-session.services';

describe('ManageSessionServices', () => {
  let service: ManageSessionServices;
  let mockIdle: jasmine.SpyObj<Idle>;
  let mockKeepAlive: jasmine.SpyObj<Keepalive>;
  let idleEnd: Subject<void>;
  let timeout: Subject<void>;
  let timeoutWarning: Subject<number>;
  let ping: Subject<void>;
  let events: { type: string; countdown?: string; isVisible?: boolean }[];
  let subscription: Subscription;

  beforeEach(() => {
    idleEnd = new Subject<void>();
    timeout = new Subject<void>();
    timeoutWarning = new Subject<number>();
    ping = new Subject<void>();
    mockIdle = jasmine.createSpyObj('Idle', [
      'setIdleName',
      'setTimeout',
      'setInterrupts',
      'setIdle',
      'watch'
    ], { onIdleEnd: idleEnd, onTimeout: timeout, onTimeoutWarning: timeoutWarning });
    mockKeepAlive = jasmine.createSpyObj('KeepInterval', ['interval'], { onPing: ping });
    TestBed.configureTestingModule({
      providers: [
        { provide: Idle, useValue: mockIdle },
        { provide: Keepalive, useValue: mockKeepAlive },
        ManageSessionServices
      ]
    });
    service = TestBed.inject(ManageSessionServices);
    events = [];
    subscription = service.appStateChanges().subscribe((event) => events.push(event));
  });

  afterEach(() => {
    subscription.unsubscribe();
    idleEnd.complete();
    timeout.complete();
    timeoutWarning.complete();
    ping.complete();
  });

  const idleConfig: IdleConfigModel = {
    timeout: 10 * 60,
    idleMilliseconds: 30 * 60 * 1000,
    keepAliveInSeconds: 5 * 60 * 60,
    idleServiceName: 'idleSession'
  };

  it('should configure idle, interrupts, keepalive and watching from the public config', () => {
    service.init(idleConfig);

    expect(mockIdle.setIdleName).toHaveBeenCalledOnceWith('idleSession');
    expect(mockIdle.setTimeout).toHaveBeenCalledOnceWith(idleConfig.timeout);
    expect(mockIdle.setInterrupts).toHaveBeenCalledOnceWith([jasmine.any(DocumentInterruptSource)]);
    expect(mockKeepAlive.interval).toHaveBeenCalledOnceWith(idleConfig.keepAliveInSeconds);
    expect(mockIdle.setIdle).toHaveBeenCalledOnceWith(30 * 60 - idleConfig.timeout);
    expect(mockIdle.watch).toHaveBeenCalledTimes(1);
  });

  it('should emit a signout event when idle times out', () => {
    service.init(idleConfig);

    timeout.next();

    expect(events).toEqual([{ type: 'signout' }]);
  });

  it('should emit a visible seconds countdown at and below one minute', () => {
    service.init(idleConfig);

    timeoutWarning.next(60);
    timeoutWarning.next(1);

    expect(events).toEqual([
      { type: 'modal', countdown: '60 seconds', isVisible: true },
      { type: 'modal', countdown: '1 seconds', isVisible: true }
    ]);
  });

  it('should round countdowns above one minute up to whole minutes', () => {
    service.init(idleConfig);

    timeoutWarning.next(61);
    timeoutWarning.next(121);

    expect(events).toEqual([
      { type: 'modal', countdown: '2 minutes', isVisible: true },
      { type: 'modal', countdown: '3 minutes', isVisible: true }
    ]);
  });

  it('should deduplicate consecutive countdowns with the same displayed value', () => {
    service.init(idleConfig);

    timeoutWarning.next(61);
    timeoutWarning.next(62);
    timeoutWarning.next(60);
    timeoutWarning.next(60);

    expect(events).toEqual([
      { type: 'modal', countdown: '2 minutes', isVisible: true },
      { type: 'modal', countdown: '60 seconds', isVisible: true }
    ]);
  });

  it('should emit a hidden modal reset 250 milliseconds after idle ends', fakeAsync(() => {
    service.init(idleConfig);

    idleEnd.next();
    tick(249);
    expect(events).toEqual([]);

    tick(1);

    expect(events).toEqual([{ type: 'modal', countdown: undefined, isVisible: false }]);
  }));

  it('should configure and emit keepalive events through the public stream', () => {
    service.init(idleConfig);

    ping.next();

    expect(mockKeepAlive.interval).toHaveBeenCalledOnceWith(idleConfig.keepAliveInSeconds);
    expect(events).toEqual([{ type: 'keepalive' }]);
  });

  it('should preserve event order across warning, keepalive and timeout notifications', () => {
    service.init(idleConfig);

    timeoutWarning.next(30);
    ping.next();
    timeout.next();

    expect(events).toEqual([
      { type: 'modal', countdown: '30 seconds', isVisible: true },
      { type: 'keepalive' },
      { type: 'signout' }
    ]);
  });
});
