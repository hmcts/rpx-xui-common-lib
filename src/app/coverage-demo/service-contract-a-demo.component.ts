import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { LDClient } from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  GoogleAnalyticsService,
  GoogleTagManagerService,
  LaunchDarklyService,
  ManageSessionServices,
  RoleGuard,
  RoleMatching,
  RoleService,
  TimeoutNotificationsService
} from 'projects/exui-common-lib/src/public-api';
import { SessionStorageService } from 'projects/exui-common-lib/src/lib/services/storage/session-storage/session-storage.service';
import { IdleConfigModel } from 'projects/exui-common-lib/src/lib/models/idle-config.model';
import { TimeoutNotificationConfig } from 'projects/exui-common-lib/src/lib/models/timeout-notification.model';

type ServiceContractAWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

@Injectable()
export class ServiceContractAIdleStub {
  public readonly onIdleEnd = new Subject<void>();
  public readonly onTimeout = new Subject<void>();
  public readonly onTimeoutWarning = new Subject<number>();
  public readonly onIdleStart = new Subject<void>();

  public setIdleName(): void {}

  public setTimeout(): void {}

  public setInterrupts(): void {}

  public setIdle(): void {}

  public watch(): void {}

  public stop(): void {}

  public clearInterrupts(): void {}
}

@Injectable()
export class ServiceContractAKeepaliveStub {
  public readonly onPing = new Subject<void>();

  public interval(): void {}
}

@Component({
  selector: 'app-service-contract-a-demo',
  templateUrl: './service-contract-a-demo.component.html',
  providers: [
    ServiceContractAIdleStub,
    ServiceContractAKeepaliveStub,
    { provide: Idle, useExisting: ServiceContractAIdleStub },
    { provide: Keepalive, useExisting: ServiceContractAKeepaliveStub },
    ManageSessionServices,
    TimeoutNotificationsService,
    RoleService,
    RoleGuard,
    LaunchDarklyService,
    SessionStorageService
  ],
  standalone: false
})
export class ServiceContractADemoComponent implements OnInit, OnDestroy {
  public readonly feature = new URLSearchParams(window.location.search).get('feature') || 'role';
  public readonly storageKey = 'service-contract-a-session';
  public roleResult = 'not evaluated';
  public storageResult = 'empty';
  public manageSessionEvents: Array<{ type: string; countdown?: string; isVisible?: boolean }> = [];
  public timeoutEvents: Array<{ eventType: string; readableCountdown?: string }> = [];
  public analyticsEvents: unknown[][] = [];
  public analyticsStatus = 'not initialised';
  public tagManagerStatus = 'not initialised';
  public launchDarklyValues: boolean[] = [];
  public launchDarklyArrayValues: string[][] = [];
  public timeoutClosed = false;

  private readonly launchDarklyFeature = 'service-contract-a-enabled';
  private readonly launchDarklyArrayFeature = 'service-contract-a-options';
  private readonly launchDarklyValuesByFeature = new Map<string, unknown>();
  private readonly launchDarklyChangeHandlers: Record<string, (value: unknown) => void> = {};
  private manageSessionSubscription?: Subscription;
  private timeoutSubscription?: Subscription;
  private timeoutInitialised = false;

  constructor(
    private readonly router: Router,
    private readonly roleService: RoleService,
    private readonly roleGuard: RoleGuard,
    private readonly sessionStorage: SessionStorageService,
    private readonly manageSession: ManageSessionServices,
    private readonly manageSessionIdle: ServiceContractAIdleStub,
    private readonly manageSessionKeepalive: ServiceContractAKeepaliveStub,
    private readonly timeoutNotifications: TimeoutNotificationsService,
    private readonly timeoutIdle: ServiceContractAIdleStub,
    private readonly timeoutKeepalive: ServiceContractAKeepaliveStub,
    private readonly googleAnalytics: GoogleAnalyticsService,
    private readonly googleTagManager: GoogleTagManagerService,
    private readonly launchDarkly: LaunchDarklyService
  ) {}

  public get tagManagerEvents(): unknown[] {
    return (window as ServiceContractAWindow).dataLayer?.map((event) => {
      if (!event || typeof event !== 'object') {
        return event;
      }
      const normalised = { ...(event as Record<string, unknown>) };
      delete normalised['gtm.start'];
      return normalised;
    }) ?? [];
  }

  public ngOnInit(): void {
    if (this.feature === 'role') {
      this.roleService.roles = ['service-contract-a-reader'];
    }
    if (this.feature === 'storage') {
      this.storageResult = this.sessionStorage.getItem(this.storageKey) ?? 'empty';
    }
    if (this.feature === 'manage-session') {
      this.startManageSession();
    }
    if (this.feature === 'timeout') {
      this.startTimeoutNotifications();
    }
    if (this.feature === 'analytics' || this.feature === 'tag-manager') {
      this.resetTelemetryState();
    }
    if (this.feature === 'launchdarkly') {
      this.installLaunchDarklyStub();
    }
  }

  public ngOnDestroy(): void {
    this.manageSessionSubscription?.unsubscribe();
    this.timeoutSubscription?.unsubscribe();
    if (this.timeoutInitialised) {
      this.timeoutNotifications.close();
    }
  }

  public setAllowedRole(): void {
    this.roleService.roles = ['service-contract-a-reader', 'service-contract-a-editor'];
    this.evaluateRoles(RoleMatching.ANY, ['service-contract-a-reader']);
  }

  public setDeniedRole(): void {
    this.roleService.roles = ['service-contract-a-reader'];
    this.evaluateRoles(RoleMatching.ANY, ['service-contract-a-admin']);
  }

  public setAllRoles(): void {
    this.roleService.roles = ['service-contract-a-reader', 'service-contract-a-editor'];
    this.evaluateRoles(RoleMatching.ALL, ['service-contract-a-reader', 'service-contract-a-editor']);
  }

  public writeStorage(): void {
    this.sessionStorage.setItem(this.storageKey, 'stored-value');
    this.storageResult = this.sessionStorage.getItem(this.storageKey) ?? 'empty';
  }

  public readAndRemoveStorage(): void {
    this.storageResult = this.sessionStorage.getItem(this.storageKey, true) ?? 'empty';
  }

  public clearStorage(): void {
    this.sessionStorage.clear();
    this.storageResult = 'empty';
  }

  public emitManageWarning(seconds: number): void {
    this.manageSessionIdle.onTimeoutWarning.next(seconds);
  }

  public emitManageIdleEnd(): void {
    this.manageSessionIdle.onIdleEnd.next();
  }

  public emitManageTimeout(): void {
    this.manageSessionIdle.onTimeout.next();
  }

  public emitManageKeepalive(): void {
    this.manageSessionKeepalive.onPing.next();
  }

  public emitTimeoutWarning(seconds: number): void {
    this.timeoutIdle.onTimeoutWarning.next(seconds);
  }

  public emitTimeout(): void {
    this.timeoutIdle.onTimeout.next();
  }

  public emitKeepalive(): void {
    this.timeoutKeepalive.onPing.next();
  }

  public resetTimeout(): void {
    this.timeoutNotifications.reset();
  }

  public closeTimeout(): void {
    this.timeoutNotifications.close();
    this.timeoutClosed = true;
  }

  public initialiseAnalytics(): void {
    this.resetTelemetryState();
    this.googleAnalytics.init('G-SERVICE-CONTRACT-A');
    (window as ServiceContractAWindow).gtag = (...args: unknown[]) => this.analyticsEvents.push(args);
    this.analyticsStatus = 'initialised';
  }

  public sendAnalyticsEvent(): void {
    this.googleAnalytics.event('service-contract-a-event', { synthetic: true });
    this.analyticsStatus = 'event sent';
  }

  public sendAnalyticsEventWithoutStub(): void {
    (window as ServiceContractAWindow).gtag = undefined;
    this.googleAnalytics.event('service-contract-a-unavailable', { synthetic: true });
    this.analyticsStatus = 'unavailable';
  }

  public initialiseTagManager(): void {
    this.resetTelemetryState();
    this.googleTagManager.init('GTM-SERVICE-CONTRACT-A');
    this.tagManagerStatus = 'initialised';
  }

  public sendTagManagerEvent(): void {
    this.googleTagManager.event('service-contract-a-event', { synthetic: true });
    this.tagManagerStatus = 'event sent';
  }

  public sendVirtualPageView(): void {
    this.googleTagManager.virtualPageView(
      'service-contract-a-pageview',
      '/service-contract-a/synthetic',
      'Service contract A',
      { synthetic: true }
    );
    this.tagManagerStatus = 'virtual pageview sent';
  }

  public clearTagManagerLayer(): void {
    delete (window as ServiceContractAWindow).dataLayer;
    this.tagManagerStatus = 'layer cleared';
  }

  public changeLaunchDarklyFlag(): void {
    this.launchDarklyValuesByFeature.set(this.launchDarklyFeature, false);
    this.launchDarklyChangeHandlers[`change:${this.launchDarklyFeature}`]?.(false);
  }

  private evaluateRoles(roleMatching: RoleMatching, needsRole: string[]): void {
    const snapshot = {
      data: {
        needsRole,
        roleMatching,
        noRoleMatchRedirect: '/service-contract-a/denied'
      }
    } as unknown as ActivatedRouteSnapshot;

    this.roleGuard.canActivate(snapshot).pipe(take(1)).subscribe((result) => {
      this.roleResult = result === true ? 'allowed' : this.router.serializeUrl(result as UrlTree);
    });
  }

  private startManageSession(): void {
    this.manageSessionSubscription = this.manageSession.appStateChanges().subscribe((event) => {
      this.manageSessionEvents.push(event);
    });
    const config: IdleConfigModel = {
      timeout: 60,
      idleMilliseconds: 5 * 60_000,
      keepAliveInSeconds: 45,
      idleServiceName: 'service-contract-a-manage'
    };
    this.manageSession.init(config);
  }

  private startTimeoutNotifications(): void {
    this.timeoutSubscription = this.timeoutNotifications.notificationOnChange().subscribe((event) => {
      this.timeoutEvents.push(event);
    });
    const config: TimeoutNotificationConfig = {
      idleModalDisplayTime: 2 * 60_000,
      totalIdleTime: 10 * 60_000 + 999,
      keepAliveInSeconds: 45,
      idleServiceName: 'service-contract-a-timeout'
    };
    this.timeoutNotifications.initialise(config);
    this.timeoutInitialised = true;
  }

  private resetTelemetryState(): void {
    this.analyticsEvents = [];
    this.analyticsStatus = 'not initialised';
    this.tagManagerStatus = 'not initialised';
    (window as ServiceContractAWindow).dataLayer = [];
    delete (window as ServiceContractAWindow).gtag;
  }

  private installLaunchDarklyStub(): void {
    this.launchDarklyValuesByFeature.set(this.launchDarklyFeature, true);
    this.launchDarklyValuesByFeature.set(this.launchDarklyArrayFeature, ['alpha', 'beta']);
    const client = {
      on: (event: string, listener: (value: unknown) => void): void => {
        this.launchDarklyChangeHandlers[event] = listener;
      },
      variation: (feature: string, defaultValue: unknown): unknown =>
        this.launchDarklyValuesByFeature.get(feature) ?? defaultValue
    } as unknown as LDClient;
    const internals = this.launchDarkly as unknown as {
      client: LDClient;
      ready: BehaviorSubject<boolean>;
    };
    internals.client = client;
    internals.ready.next(false);
    this.launchDarkly.isEnabled(this.launchDarklyFeature, false).subscribe((value) => {
      this.launchDarklyValues.push(value);
    });
    this.launchDarkly.getArray<string>(this.launchDarklyArrayFeature).subscribe((value) => {
      this.launchDarklyArrayValues.push(value);
    });
    internals.ready.next(true);
  }
}
