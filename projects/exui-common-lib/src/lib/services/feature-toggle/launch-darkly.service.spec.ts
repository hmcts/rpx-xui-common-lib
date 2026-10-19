import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { LDClient, LDContext } from 'launchdarkly-js-client-sdk';
import { launchDarklyClient } from './launch-darkly-client';
import { LaunchDarklyService } from './launch-darkly.service';

type EventListener = (...args: any[]) => void;

describe('LaunchDarklyService', () => {
  let service: LaunchDarklyService;
  let client: LDClient;
  let variationSpy: jasmine.Spy;
  let identifySpy: jasmine.Spy;
  let eventHandlers: Record<string, EventListener>;
  let resolveIdentify: (flags: any) => void = () => {};
  let createdClient: { clientId: string; context: LDContext } | undefined;

  class TestLaunchDarklyService extends LaunchDarklyService {
    protected override createClient(clientId: string, context: LDContext): LDClient {
      createdClient = { clientId, context };
      return client;
    }
  }

  beforeEach(() => {
    eventHandlers = {};
    const onSpy = jasmine.createSpy('on').and.callFake((event: string, listener: EventListener) => {
      eventHandlers[event] = listener;
    });
    variationSpy = jasmine.createSpy('variation').and.returnValue(false);
    identifySpy = jasmine.createSpy('identify').and.returnValue(new Promise((resolve) => {
      resolveIdentify = resolve;
    }));
    client = { on: onSpy, identify: identifySpy, variation: variationSpy } as unknown as LDClient;
    createdClient = undefined;
    service = new TestLaunchDarklyService();
  });

  function initializeService(): void {
    service.initialize({ key: 'user-key', roles: ['caseworker'], orgId: 'org-id' }, 'client-id');
    eventHandlers['ready']();
    resolveIdentify({});
    flushMicrotasks();
  }

  it('should initialise the SDK with the user context and wait for identification before ready', fakeAsync(() => {
    const values: boolean[] = [];
    service.getValue('feature', false).subscribe((value) => values.push(value));

    expect(values).toEqual([false]);
    variationSpy.and.returnValue(true);

    service.initialize({ key: 'user-key', roles: ['caseworker'], orgId: 'org-id' }, 'client-id');
    expect(createdClient).toEqual({
      clientId: 'client-id',
      context: { kind: 'user', key: 'user-key', roles: ['caseworker'], orgId: 'org-id' }
    });

    eventHandlers['ready']();
    expect(identifySpy).toHaveBeenCalledOnceWith({
      kind: 'user', key: 'user-key', roles: ['caseworker'], orgId: 'org-id'
    });
    expect(values).toEqual([false]);
    expect(variationSpy).not.toHaveBeenCalled();

    resolveIdentify({});
    flushMicrotasks();

    expect(values).toEqual([false, true]);
    expect(variationSpy).toHaveBeenCalledWith('feature', false);
  }));

  it('should use the default SDK factory with reporting enabled', () => {
    const sdkClient = { on: jasmine.createSpy('on') } as unknown as LDClient;
    const initializeSpy = spyOn(launchDarklyClient, 'initialize').and.returnValue(sdkClient);
    const defaultService = new LaunchDarklyService();
    const user = { key: 'user-key', anonymous: false, roles: ['caseworker'], orgId: 'org-id' };

    defaultService.initialize(user, 'client-id');

    expect(initializeSpy).toHaveBeenCalledOnceWith(
      'client-id',
      { kind: 'user', ...user },
      { useReport: true }
    );
  });

  it('should update a cached value when the feature change event fires', fakeAsync(() => {
    const values: boolean[] = [];
    variationSpy.and.returnValue(false);
    service.getValue('feature', true).subscribe((value) => values.push(value));

    initializeService();
    eventHandlers['change:feature'](true);

    expect(values).toEqual([true, false, true]);
  }));

  it('should suppress duplicate cached values while allowing a changed value', fakeAsync(() => {
    const values: boolean[] = [];
    variationSpy.and.returnValue(true);
    service.getValue('feature', false).subscribe((value) => values.push(value));

    initializeService();
    eventHandlers['change:feature'](true);
    eventHandlers['change:feature'](false);

    expect(values).toEqual([false, true, false]);
  }));

  it('should emit getValueOnce only after ready', fakeAsync(() => {
    const values: string[] = [];
    variationSpy.and.returnValue('server-value');
    service.getValueOnce('feature', 'default-value').subscribe((value) => values.push(value));

    expect(values).toEqual([]);
    initializeService();

    expect(values).toEqual(['server-value']);
    expect(variationSpy).toHaveBeenCalledOnceWith('feature', 'default-value');
  }));

  it('should return the synchronous SDK variation with its default', () => {
    variationSpy.and.returnValue('sync-value');
    service.initialize({ anonymous: true }, 'client-id');
    expect(service.getValueSync('feature', 'default-value')).toBe('sync-value');
    expect(variationSpy).toHaveBeenCalledOnceWith('feature', 'default-value');
  });

  it('should provide boolean and array defaults through the convenience methods', fakeAsync(() => {
    const enabled: boolean[] = [];
    const arrays: string[][] = [];
    variationSpy.and.callFake((feature: string) => feature === 'enabled' ? true : ['value']);
    service.isEnabled('enabled').subscribe((value) => enabled.push(value));
    service.getArray<string>('array').subscribe((value) => arrays.push(value));

    initializeService();

    expect(enabled).toEqual([false, true]);
    expect(arrays).toEqual([[], ['value']]);
  }));

  it('should release readiness when the SDK reports an error', fakeAsync(() => {
    const values: boolean[] = [];
    variationSpy.and.returnValue(true);
    service.getValue('feature', false).subscribe((value) => values.push(value));
    const error = new Error('network failure');
    const consoleError = spyOn(console, 'error');

    service.initialize({ anonymous: true }, 'client-id');
    eventHandlers['error'](error);

    expect(consoleError).toHaveBeenCalledWith('LaunchDarkly client network error:', error);
    expect(values).toEqual([false, true]);
    expect(variationSpy).toHaveBeenCalledOnceWith('feature', false);
  }));

  it('should release readiness when identification fails', fakeAsync(() => {
    const values: boolean[] = [];
    variationSpy.and.returnValue(true);
    service.getValue('feature', false).subscribe((value) => values.push(value));
    const error = new Error('identification failure');
    const consoleError = spyOn(console, 'error');

    identifySpy.and.returnValue(Promise.reject(error));
    service.initialize({ anonymous: true }, 'client-id');
    eventHandlers['ready']();
    flushMicrotasks();

    expect(consoleError).toHaveBeenCalledWith('LaunchDarkly client network error:', error);
    expect(values).toEqual([false, true]);
    expect(variationSpy).toHaveBeenCalledOnceWith('feature', false);
  }));
});
