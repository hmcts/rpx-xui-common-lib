import { Injectable } from '@angular/core';
import {DocumentInterruptSource, Idle, WindowInterruptSource} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import {TimeoutNotificationConfig} from '../../models';

/**
 * TimeoutNotificationsService
 *
 * The Timeout Notification Service allows your application to receive notifications
 * when a User is approaching the total time that a User has been idle for.
 *
 * This can be set by your application using the Timeout Notification Config object.
 *
 * Your application will then have to listen to events coming from the Timeout Notification Service,
 * and handle these events within your application.
 *
 * @see README.md for implementation details and code, on how to implement the Timeout Notification
 * Service within your application.
 */
@Injectable({
  providedIn: 'root'
})
export class TimeoutNotificationsService {

  private readonly subs: Subscription[] = [];
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
   * Initialise
   *
   * Initialise the Timeout Notification Events.
   *
   * I made the decision not to make ' minutes' and ' seconds' configurable via input parameters -
   * As I made an assumption that any Reform team would not need to change these to 'secs, mins' or 's, m'.
   *
   * idleModalDisplayTime and totalIdleTime need to be passed in, in milliseconds.
   *
   * @see README.md for more information on TimeoutNotificationService.
   */
  public initialise(config: TimeoutNotificationConfig): void {

    const DOCUMENT_INTERRUPTS = 'mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll';

    const MINUTES = ' minutes';
    const SECONDS = ' seconds';

    const SIGNOUT_EVENT = 'sign-out';
    const COUNTDOWN_EVENT = 'countdown';
    const KEEP_ALIVE_EVENT = 'keep-alive';

    const {idleServiceName, idleModalDisplayTime, totalIdleTime} = config;

    this.idle.setIdleName(idleServiceName);

    const idleModalDisplayTimeInSeconds = this.millisecondsToSeconds(idleModalDisplayTime);
    const totalIdleTimeInSeconds = this.millisecondsToSeconds(totalIdleTime);

    this.idle.setTimeout(idleModalDisplayTimeInSeconds);

    const docInterrupts = new DocumentInterruptSource(DOCUMENT_INTERRUPTS);
    const windowInterrupts = new WindowInterruptSource(DOCUMENT_INTERRUPTS);
    this.idle.setInterrupts([docInterrupts, windowInterrupts]);

    this.subs.push(this.idle.onTimeout.subscribe(() => {
      this.eventEmitter.next({eventType: SIGNOUT_EVENT});
    }));

    this.subs.push(this.idle.onTimeoutWarning.pipe(
      map(sec => (sec > 60) ? Math.ceil(sec / 60) + MINUTES : sec + SECONDS),
      distinctUntilChanged()
    ).subscribe((countdown) => {
      this.eventEmitter.next({eventType: COUNTDOWN_EVENT, readableCountdown: countdown});
    }));
    this.subs.push(this.idle.onIdleStart.subscribe(() => console.log('You\'ve gone idle!')));
    this.subs.push(this.idle.onIdleEnd.subscribe(() => console.log('You\'re no longer idle!')));

    this.keepalive.interval(15);
    this.subs.push(this.keepalive.onPing.subscribe(() => {
      this.eventEmitter.next({eventType: KEEP_ALIVE_EVENT});
    }));

    const idleInSeconds = Math.floor(totalIdleTimeInSeconds) - idleModalDisplayTimeInSeconds;
    this.idle.setIdle(idleInSeconds);
    this.idle.watch();
  }

  public reset(): void {
    this.idle.watch();
  }

  public close(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.idle.stop();
    this.idle.clearInterrupts();
  }

  /**
   * Expose the notification events, so that a 3rd party service can listen to the notifications.
   */
  public notificationOnChange(): Observable<any> {
    return this.eventEmitter.asObservable();
  }
}
