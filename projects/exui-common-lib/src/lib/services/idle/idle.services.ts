import { Injectable } from '@angular/core';
import {DocumentInterruptSource, Idle, } from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {Observable, Subject} from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import {IdleConfigModel} from '../../models/idle-config.model';

@Injectable()
export class IdleService {
  private appStateEmitter: Subject<{type: string, countdown?: string; isVisible?: boolean}>;
  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
  ) {
    this.appStateEmitter = new Subject();
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
      this.appStateEmitter.next({type: 'modal', countdown, isVisible: true});
    });

    this.keepalive.interval(idleConfig.keepAliveInSeconds);
    this.keepalive.onPing.pipe(delay(250)).subscribe(() => {
      this.appStateEmitter.next({type: 'keepalive'})
    });
    const idleInSeconds = Math.floor((idleConfig.idleMilliseconds / 1000)) - idleConfig.timeout;
    this.idle.setIdle(idleInSeconds);
    this.idle.watch();
  }

  public appStateChanges(): Observable<any> {
    return this.appStateEmitter.asObservable();
  }

}
