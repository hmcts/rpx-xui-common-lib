import { DocumentInterruptSource, Idle, WindowInterruptSource } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Subject, Subscription } from 'rxjs';
import { TimeoutNotificationConfig } from '../../models';
import { TimeoutNotificationsService } from './timeout-notifications.service';

describe('TimeoutNotificationsService', () => {
  let service: TimeoutNotificationsService;
  let idle: jasmine.SpyObj<Idle>;
  let keepalive: jasmine.SpyObj<Keepalive>;
  let warning: Subject<number>;
  let timeout: Subject<void>;
  let idleStart: Subject<void>;
  let idleEnd: Subject<void>;
  let ping: Subject<void>;
  let subscription: Subscription;
  let events: { eventType: string; readableCountdown?: string }[];
  const config: TimeoutNotificationConfig = {
    idleServiceName: 'unit-timeout',
    idleModalDisplayTime: 2 * 60_000,
    totalIdleTime: 10 * 60_000 + 999
  };

  beforeEach(() => {
    warning = new Subject<number>();
    timeout = new Subject<void>();
    idleStart = new Subject<void>();
    idleEnd = new Subject<void>();
    ping = new Subject<void>();
    idle = jasmine.createSpyObj('Idle', [
      'setIdleName', 'setTimeout', 'setIdle', 'setInterrupts', 'watch', 'stop', 'clearInterrupts'
    ], { onTimeoutWarning: warning, onTimeout: timeout, onIdleStart: idleStart, onIdleEnd: idleEnd });
    keepalive = jasmine.createSpyObj('Keepalive', ['interval'], { onPing: ping });
    service = new TimeoutNotificationsService(idle, keepalive);
    events = [];
    subscription = service.notificationOnChange().subscribe(event => events.push(event));
  });

  afterEach(() => {
    service.close();
    subscription.unsubscribe();
    warning.complete();
    timeout.complete();
    idleStart.complete();
    idleEnd.complete();
    ping.complete();
  });

  it('should configure idle timing, interrupts and the default keepalive and start watching', () => {
    service.initialise(config);

    expect(idle.setIdleName).toHaveBeenCalledOnceWith('unit-timeout');
    expect(idle.setTimeout).toHaveBeenCalledOnceWith(120);
    expect(idle.setIdle).toHaveBeenCalledOnceWith(480);
    expect(idle.setInterrupts).toHaveBeenCalledOnceWith([
      jasmine.any(DocumentInterruptSource), jasmine.any(WindowInterruptSource)
    ]);
    expect(keepalive.interval).toHaveBeenCalledOnceWith(600);
    expect(idle.watch).toHaveBeenCalledTimes(1);
    expect(events).toEqual([]);
  });

  it('should use a positive custom keepalive interval unchanged', () => {
    service.initialise({ ...config, keepAliveInSeconds: 45 });

    expect(keepalive.interval).toHaveBeenCalledOnceWith(45);
  });

  it('should emit exact countdown payloads at the minute boundary and final second', () => {
    service.initialise(config);
    warning.next(61);
    warning.next(60);
    warning.next(1);

    expect(events).toEqual([
      { eventType: 'countdown', readableCountdown: '2 minutes' },
      { eventType: 'countdown', readableCountdown: '60 seconds' },
      { eventType: 'countdown', readableCountdown: '1 seconds' }
    ]);
  });

  it('should deduplicate consecutive formatted countdowns and emit a returning value', () => {
    service.initialise(config);
    warning.next(62);
    warning.next(61);
    warning.next(60);
    warning.next(60);
    warning.next(61);

    expect(events).toEqual([
      { eventType: 'countdown', readableCountdown: '2 minutes' },
      { eventType: 'countdown', readableCountdown: '60 seconds' },
      { eventType: 'countdown', readableCountdown: '2 minutes' }
    ]);
  });

  it('should emit exact sign-out and keep-alive payloads', () => {
    service.initialise(config);
    timeout.next();
    ping.next();

    expect(events).toEqual([{ eventType: 'sign-out' }, { eventType: 'keep-alive' }]);
  });

  it('should watch once more without notifying when reset', () => {
    service.initialise(config);
    expect(idle.watch).toHaveBeenCalledTimes(1);

    service.reset();

    expect(idle.watch).toHaveBeenCalledTimes(2);
    expect(events).toEqual([]);
  });

  it('should stop idle, clear interrupts and prevent all later notifications on close', () => {
    service.initialise(config);
    warning.next(61);
    timeout.next();
    ping.next();
    expect(events).toEqual([
      { eventType: 'countdown', readableCountdown: '2 minutes' },
      { eventType: 'sign-out' },
      { eventType: 'keep-alive' }
    ]);

    service.close();
    warning.next(60);
    timeout.next();
    ping.next();

    expect(idle.stop).toHaveBeenCalledTimes(1);
    expect(idle.clearInterrupts).toHaveBeenCalledTimes(1);
    expect(events).toEqual([
      { eventType: 'countdown', readableCountdown: '2 minutes' },
      { eventType: 'sign-out' },
      { eventType: 'keep-alive' }
    ]);
  });
});
