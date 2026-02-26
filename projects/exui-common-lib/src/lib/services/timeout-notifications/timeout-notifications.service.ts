import { Inject, Injectable, Optional } from '@angular/core';
import { TELEMETRY_SERVICE, TelemetryService } from '../../telemetry/telemetry.token';
import { DocumentInterruptSource, Idle, WindowInterruptSource } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import { TimeoutNotificationConfig } from '../../models';

/**
 * TimeoutNotificationsService
 *
 * Emits:
 *  - 'countdown' updates (readable countdown)
 *  - 'sign-out' when timeout reached
 *  - 'keep-alive' on keepalive pings
 *
 * Accepts idleModalDisplayTime and totalIdleTime in milliseconds.
 */
@Injectable({
  providedIn: 'root'
})
export class TimeoutNotificationsService {

  private readonly subs: Subscription[] = [];
  private readonly eventEmitter: Subject<{ eventType: string, readableCountdown?: string; }>;

  constructor(
    private readonly idle: Idle,
    private readonly keepalive: Keepalive,
    @Optional() @Inject(TELEMETRY_SERVICE) private telemetry?: TelemetryService
  ) {
    this.eventEmitter = new Subject();
  }

  /** Convert milliseconds to seconds. */
  public millisecondsToSeconds = (milliseconds: number): number => milliseconds / 1000;

  /**
   * Initialise the Timeout Notification Events.
   * idleModalDisplayTime and totalIdleTime must be provided in milliseconds.
   */
  public initialise(config: TimeoutNotificationConfig): void {

    const DOCUMENT_INTERRUPTS = 'mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll';

    const MINUTES = ' minutes';
    const SECONDS = ' seconds';

    const SIGNOUT_EVENT = 'sign-out';
    const COUNTDOWN_EVENT = 'countdown';
    const KEEP_ALIVE_EVENT = 'keep-alive';

    // Defensive guards
    if (!config) {
      console.warn('TimeoutNotificationsService.initialise called without config');
      return;
    }

    const idleServiceName = (config as any).idleServiceName;
    const idleModalDisplayTime = (config as any).idleModalDisplayTime;
    const totalIdleTime = (config as any).totalIdleTime;
    // keepAliveInSeconds is optional — fallback to undefined here and handle default later
    const keepAliveInSeconds = (config as any).keepAliveInSeconds;


    // telemetry: record initialise (no userId here; library shouldn't assume it)
    try {
      this.telemetry?.log('timeout_notification_initialise', null, {
        idleServiceName,
        idleModalDisplayTime,
        totalIdleTime,
        keepAliveInSeconds: keepAliveInSeconds || null,
        trace_origin: 'timeout-notifications-service'
      });
    } catch (e) {
      // fail safe: telemetry must not block runtime
      // eslint-disable-next-line no-console
      console.warn('telemetry log failed in initialise', e);
    }

    const traceId = this.telemetry?.traceId || null;

    this.idle.setIdleName(idleServiceName);
    // eslint-disable-next-line no-console
    console.log('Idle service config:', config);
    // eslint-disable-next-line no-console
    console.log(`Idle service ${idleServiceName} will display modal after ${idleModalDisplayTime} milliseconds, and timeout after ${totalIdleTime} milliseconds.`);

    const idleModalDisplayTimeInSeconds = this.millisecondsToSeconds(idleModalDisplayTime || 0);
    const totalIdleTimeInSeconds = this.millisecondsToSeconds(totalIdleTime || 0);

    // set how long the countdown should run before sign-out (timeout)
    this.idle.setTimeout(Math.floor(idleModalDisplayTimeInSeconds));

    const docInterrupts = new DocumentInterruptSource(DOCUMENT_INTERRUPTS);
    const windowInterrupts = new WindowInterruptSource(DOCUMENT_INTERRUPTS);
    this.idle.setInterrupts([docInterrupts, windowInterrupts]);

    // Sign-out handler
    this.subs.push(this.idle.onTimeout.subscribe(() => {
      try {
        this.telemetry?.log('timeout_notification_emit', null, { eventType: SIGNOUT_EVENT, trace_id: traceId, emittedAt: new Date().toISOString() });
      } catch (e) {
        // swallow telemetry errors
        // eslint-disable-next-line no-console
        console.warn('telemetry log failed on onTimeout', e);
      }
      this.eventEmitter.next({ eventType: SIGNOUT_EVENT });
    }));

    // Countdown updates (every minute >60s; every second <=60s)
    this.subs.push(this.idle.onTimeoutWarning.pipe(
      map(sec => (sec > 60) ? Math.ceil(sec / 60) + MINUTES : sec + SECONDS),
      distinctUntilChanged()
    ).subscribe((countdown) => {
      try {
        this.telemetry?.log('timeout_notification_emit', null, { eventType: COUNTDOWN_EVENT, readableCountdown: countdown, trace_id: traceId, emittedAt: new Date().toISOString() });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('telemetry log failed on onTimeoutWarning', e);
      }
      this.eventEmitter.next({ eventType: COUNTDOWN_EVENT, readableCountdown: countdown });
    }));

    // Idle start / end - useful to detect start/end of idle period
    this.subs.push(this.idle.onIdleStart.subscribe(() => {
      try { this.telemetry?.log('timeout_notification_idle_start', null, { trace_id: traceId, at: new Date().toISOString() }); } catch (_) {}
      // eslint-disable-next-line no-console
      console.log('You\'ve gone idle!');
    }));
    this.subs.push(this.idle.onIdleEnd.subscribe(() => {
      try { this.telemetry?.log('timeout_notification_idle_end', null, { trace_id: traceId, at: new Date().toISOString() }); } catch (_) {}
      // eslint-disable-next-line no-console
      console.log('You\'re no longer idle!');
    }));

    // keepalive interval: prefer config value if provided, otherwise fallback to 15s
    const keepAliveInterval = (keepAliveInSeconds && Number(keepAliveInSeconds) > 0) ? Number(keepAliveInSeconds) : 15;
    this.keepalive.interval(keepAliveInterval);
    this.subs.push(this.keepalive.onPing.subscribe(() => {
      try {
        this.telemetry?.log('timeout_notification_keepalive', null, { eventType: KEEP_ALIVE_EVENT, trace_id: traceId, at: new Date().toISOString() });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('telemetry log failed on keepalive ping', e);
      }
      this.eventEmitter.next({ eventType: KEEP_ALIVE_EVENT });
    }));

    // compute idle (time between last interruption and when the modal appears)
    const idleInSeconds = Math.floor(totalIdleTimeInSeconds) - idleModalDisplayTimeInSeconds;
    this.idle.setIdle(idleInSeconds);
    this.idle.watch();

    try {
      this.telemetry?.log('timeout_notification_watch_started', null, {
        idleInSeconds,
        timeoutInSeconds: Math.floor(idleModalDisplayTimeInSeconds),
        totalIdleTimeInSeconds,
        trace_id: traceId
      });
    } catch (_) {}
  }

  public reset(): void {
    try {
      this.telemetry?.log('timeout_notification_reset_called', null, { at: new Date().toISOString(), trace_origin: 'timeout-notifications-service' });
    } catch (_) {}
    this.idle.watch();
  }

  public close(): void {
    try { this.telemetry?.log('timeout_notification_close_called', null, { at: new Date().toISOString() }); } catch (_) {}
    this.subs.forEach(s => s.unsubscribe());
    this.idle.stop();
    this.idle.clearInterrupts();
  }

  /**
   * Expose the notification events, so that a 3rd party service can listen to the notifications.
   */
  public notificationOnChange(): Observable<any> {
    // Note: we log on emit so consumers can assume the telemetry already exists
    return this.eventEmitter.asObservable();
  }
}
