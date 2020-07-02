import { Injectable } from '@angular/core';
import {DocumentInterruptSource, Idle, } from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {Observable, Subject} from 'rxjs';
import {
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import {IdleConfig} from '../../models/idle-config.model';

@Injectable()
export class TimeoutNotificationsService {

  public readonly COUNTDOWN_EVENT: 'countdown';
  public readonly SIGN_OUT_EVENT: 'sign-out';
  public readonly KEEP_ALIVE_EVENT: 'keep-alive';

  private readonly eventEmitter: Subject<{eventType: string, readableCountdown?: string; }>;

  constructor(
    private readonly idle: Idle,
    private readonly keepalive: Keepalive,
  ) {
    this.eventEmitter = new Subject();
  }

  public millisecondsToSeconds = (milliseconds: number): number => milliseconds / 1000;

  /**
   * Refactored Initialise Session Timeout
   *
   * TODO: Everything needs to be in milliseconds
   * TODO: Pass in minutes text
   * TODO: Pass in seconds text
   *
   * There is a delay of 250 milliseconds so that the User can click on sign out? Is this
   * still required.
   *
   * I made the decision not to make ' minutes' and ' seconds' configurable via input parameters,
   * as I'm not sure why any team would need to change this to 'secs, mins' or 's, m' within the Reform project.
   * - But you never know! If this needs to be changed please raise a PR.
   *
   * idleModalDisplayTime is coming in in milliseconds
   * all inputs should be in milliseconds
   *
   * TODO: Should this function have the indivdual parameters instead of them being part of one object?
   * There's only 3 parameters, so yes probably.
   */
  public initialiseSessionTimeout(idleConfig: IdleConfig): void {

    const MINUTES = ' minutes'
    const SECONDS = ' seconds'

    const DOCUMENT_INTERRUPTS = 'mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll';

    this.idle.setIdleName(idleConfig.idleServiceName);

    // idleModalDisplayTime this comes in, in seconds
    const idleModalDisplayTimeInSeconds = this.millisecondsToSeconds(idleConfig.idleModalDisplayTime);
    const totalIdleTimeInSeconds = this.millisecondsToSeconds(idleConfig.totalIdleTime);

    this.idle.setTimeout(idleModalDisplayTimeInSeconds);

    const interrupt = new DocumentInterruptSource(DOCUMENT_INTERRUPTS);
    this.idle.setInterrupts([interrupt]);

    this.idle.onTimeout.subscribe(() => {
      this.eventEmitter.next({eventType: this.SIGN_OUT_EVENT});
    });

    // not sure what this does.
    // TODO: Should we pass in the minutes and seconds consts here?
    // probably yes.
    this.idle.onTimeoutWarning.pipe(
      map(sec => (sec > 60) ? Math.ceil(sec / 60) + MINUTES : sec + SECONDS),
      distinctUntilChanged()
    ).subscribe((countdown) => {
      this.eventEmitter.next({eventType: this.COUNTDOWN_EVENT, readableCountdown: countdown});
    });

    this.keepalive.onPing.subscribe(() => {
      this.eventEmitter.next({eventType: this.KEEP_ALIVE_EVENT});
    });

    const idleInSeconds = Math.floor(totalIdleTimeInSeconds) - idleModalDisplayTimeInSeconds;
    this.idle.setIdle(idleInSeconds);
    this.idle.watch();
  }

  /**
   * Expose the events, so that the 3rd party service can listen to Timeout Notifications.
   *
   * TODO: Change to a more appropiate name
   */
  public eventEmitterChanges(): Observable<any> {
    return this.eventEmitter.asObservable();
  }
}
