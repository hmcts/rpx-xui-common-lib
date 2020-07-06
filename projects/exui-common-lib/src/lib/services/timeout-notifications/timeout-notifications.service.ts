import { Injectable } from '@angular/core';
import {DocumentInterruptSource, Idle, } from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {Observable, Subject} from 'rxjs';
import {
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import {TimeoutNotificationConfig} from '../../models/timeout-notification.model';

@Injectable()
export class TimeoutNotificationsService {

  private readonly eventEmitter: Subject<{eventType: string, readableCountdown?: string; }>;

  constructor(
    private readonly idle: Idle,
    private readonly keepalive: Keepalive,
  ) {
    this.eventEmitter = new Subject();
  }

  /**
   * Convert milliseconds to seconds.
   *
   * @param milliseconds - 1000
   * @return seconds - 1
   */
  public millisecondsToSeconds = (milliseconds: number): number => milliseconds / 1000;

  /**
   * Initialised the Timeout Notification events.
   *
   * I made the decision not to make ' minutes' and ' seconds' configurable via input parameters -
   * I'm not sure why any team would need to change this to 'secs, mins' or 's, m' within the Reform project.
   *
   * Note pass in idleModalDisplayTime, and totalIdleTime in milliseconds.
   *
   * We throw a 'countdown' event every minute, until one minute is left on the countdown. When a minute
   * is left on the countdown we throw a 'countdown' event every second.
   */
  public initialise(config: TimeoutNotificationConfig): void {

    const MINUTES = ' minutes'
    const SECONDS = ' seconds'

    const {idleServiceName, idleModalDisplayTime, totalIdleTime} = config;

    const DOCUMENT_INTERRUPTS = 'mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll';

    this.idle.setIdleName(idleServiceName);

    const idleModalDisplayTimeInSeconds = this.millisecondsToSeconds(idleModalDisplayTime);
    const totalIdleTimeInSeconds = this.millisecondsToSeconds(totalIdleTime);

    this.idle.setTimeout(idleModalDisplayTimeInSeconds);

    const interrupt = new DocumentInterruptSource(DOCUMENT_INTERRUPTS);
    this.idle.setInterrupts([interrupt]);

    this.idle.onTimeout.subscribe(() => {
      this.eventEmitter.next({eventType: 'sign-out'});
    });

    this.idle.onTimeoutWarning.pipe(
      map(sec => (sec > 60) ? Math.ceil(sec / 60) + MINUTES : sec + SECONDS),
      distinctUntilChanged()
    ).subscribe((countdown) => {
      this.eventEmitter.next({eventType: 'countdown', readableCountdown: countdown});
    });

    this.keepalive.onPing.subscribe(() => {
      this.eventEmitter.next({eventType: 'keep-alive'});
    });

    const idleInSeconds = Math.floor(totalIdleTimeInSeconds) - idleModalDisplayTimeInSeconds;
    this.idle.setIdle(idleInSeconds);
    this.idle.watch();
  }

  /**
   * Expose the notification events, so that a 3rd party service can listen to the notifications.
   */
  public notificationOnChange(): Observable<any> {

    return this.eventEmitter.asObservable();
  }
}
