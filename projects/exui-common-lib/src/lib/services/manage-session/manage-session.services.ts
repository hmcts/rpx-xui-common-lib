import { Injectable } from '@angular/core';
import {DocumentInterruptSource, Idle, } from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {Observable, Subject} from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import {IdleConfig, IdleConfigModel} from '../../models/idle-config.model';

@Injectable()
export class ManageSessionServices {
  private readonly appStateEmitter: Subject<{type: string, countdown?: string; isVisible?: boolean}>;
  private readonly eventEmitter: Subject<{eventType: string, readableCountdown?: string; }>;
  constructor(
    private readonly idle: Idle,
    private readonly keepalive: Keepalive,
  ) {
    this.appStateEmitter = new Subject();
    this.eventEmitter = new Subject();
  }

  public init(idleConfig: IdleConfigModel): void {

    this.idle.setIdleName(idleConfig.idleServiceName);
    this.idle.setTimeout(idleConfig.timeout);

    const interrupt =
      new DocumentInterruptSource('mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll');
    this.idle.setInterrupts([interrupt]);

    // adding delay so that user can click on sign out before the modal shuts
    this.idle.onIdleEnd.pipe(delay(250)).subscribe(() => {
      this.appStateEmitter.next({type: 'modal', countdown: undefined, isVisible: false});
    });

    this.idle.onTimeout.subscribe(() => {
      this.appStateEmitter.next({type: 'signout'});
    });

    this.idle.onTimeoutWarning.pipe(
      map(sec => (sec > 60) ? Math.ceil(sec / 60) + ' minutes' : sec + ' seconds'),
      distinctUntilChanged()
    ).subscribe((countdown) => {
      console.log('output');
      this.appStateEmitter.next({type: 'modal', countdown, isVisible: true});
    });

    this.keepalive.interval(idleConfig.keepAliveInSeconds);
    this.keepalive.onPing.subscribe(() => {
      this.appStateEmitter.next({type: 'keepalive'});
    });
    const idleInSeconds = Math.floor((idleConfig.idleMilliseconds / 1000)) - idleConfig.timeout;
    this.idle.setIdle(idleInSeconds);
    this.idle.watch();
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
   * idleModalDisplayTime is coming in in milliseconds
   * all inputs should be in milliseconds
   */
  public initialiseSessionTimeout(idleConfig: IdleConfig): void {

    const MINUTES = ' minutes'
    const SECONDS = ' seconds'

    const DOCUMENT_INTERRUPTS = 'mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll';

    this.idle.setIdleName(idleConfig.idleServiceName);

    // idleModalDisplayTime this comes in, in seconds
    const idleModalDisplayTimeInSeconds = idleConfig.idleModalDisplayTime / 1000;
    const totalIdleTimeInSeconds = idleConfig.totalIdleTime / 1000;

    this.idle.setTimeout(idleModalDisplayTimeInSeconds);

    const interrupt = new DocumentInterruptSource(DOCUMENT_INTERRUPTS);
    this.idle.setInterrupts([interrupt]);

    // This looks like a finishing idle end event
    // TODO: Not sure when this is getting hit.
    // this.idle.onIdleEnd.pipe(delay(250)).subscribe(() => {
    //   console.log('onIdleEnd hit');
    //   this.appStateEmitter.next({type: 'countdown', countdown: undefined});
    // });

    this.idle.onTimeout.subscribe(() => {
      this.eventEmitter.next({eventType: 'sign-out'});
    });

    // not sure what this does.
    // TODO: Should we pass in the minutes and seconds consts here?
    // probably yes.
    this.idle.onTimeoutWarning.pipe(
      map(sec => (sec > 60) ? Math.ceil(sec / 60) + MINUTES : sec + SECONDS),
      distinctUntilChanged()
    ).subscribe((countdown) => {
      this.eventEmitter.next({eventType: 'countdown', readableCountdown: countdown});
    });

    // This is set as 5 * 60 * 60
    // TODO: Do we need this?
    this.keepalive.interval(idleConfig.keepAliveInSeconds);

    this.keepalive.onPing.subscribe(() => {
      this.eventEmitter.next({eventType: 'keep-alive'});
    });

    const idleInSeconds = Math.floor(totalIdleTimeInSeconds) - idleModalDisplayTimeInSeconds;
    this.idle.setIdle(idleInSeconds);
    this.idle.watch();
  }

  public appStateChanges(): Observable<any> {
    return this.appStateEmitter.asObservable();
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
