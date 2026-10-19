import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { LDClient } from 'launchdarkly-js-client-sdk';
import { LaunchDarklyService } from './launch-darkly.service';

type EventListener = (...args: any[]) => void;

describe('LaunchDarklyService', () => {
  let service: LaunchDarklyService;
  let client: LDClient;
  let variationSpy: jasmine.Spy;
  let eventHandlers: Record<string, EventListener>;

  beforeEach(() => {
    eventHandlers = {};
    const onSpy = jasmine.createSpy('on').and.callFake((event: string, listener: EventListener) => {
      eventHandlers[event] = listener;
    });
    variationSpy = jasmine.createSpy('variation').and.returnValue(false);
    client = { on: onSpy, variation: variationSpy } as unknown as LDClient;
    service = new LaunchDarklyService();
    (service as any).client = client;
  });

  it('should emit the default value before ready and the variation after ready', fakeAsync(() => {
    const values: boolean[] = [];
    service.getValue('feature', false).subscribe((value) => values.push(value));

    expect(values).toEqual([false]);
    variationSpy.and.returnValue(true);

    (service as any).ready.next(true);
    flushMicrotasks();

    expect(values).toEqual([false, true]);
    expect(variationSpy).toHaveBeenCalledWith('feature', false);
  }));

  it('should update a cached value when the feature change event fires', fakeAsync(() => {
    const values: boolean[] = [];
    variationSpy.and.returnValue(false);
    service.getValue('feature', true).subscribe((value) => values.push(value));

    (service as any).ready.next(true);
    flushMicrotasks();
    eventHandlers['change:feature'](true);

    expect(values).toEqual([true, false, true]);
  }));

  it('should suppress duplicate cached values while allowing a changed value', fakeAsync(() => {
    const values: boolean[] = [];
    variationSpy.and.returnValue(true);
    service.getValue('feature', false).subscribe((value) => values.push(value));

    (service as any).ready.next(true);
    flushMicrotasks();
    eventHandlers['change:feature'](true);
    eventHandlers['change:feature'](false);

    expect(values).toEqual([false, true, false]);
  }));

  it('should emit getValueOnce only after ready', fakeAsync(() => {
    const values: string[] = [];
    variationSpy.and.returnValue('server-value');
    service.getValueOnce('feature', 'default-value').subscribe((value) => values.push(value));

    expect(values).toEqual([]);
    (service as any).ready.next(true);
    flushMicrotasks();

    expect(values).toEqual(['server-value']);
    expect(variationSpy).toHaveBeenCalledOnceWith('feature', 'default-value');
  }));

  it('should return the synchronous SDK variation with its default', () => {
    variationSpy.and.returnValue('sync-value');
    expect(service.getValueSync('feature', 'default-value')).toBe('sync-value');
    expect(variationSpy).toHaveBeenCalledOnceWith('feature', 'default-value');
  });

  it('should provide boolean and array defaults through the convenience methods', fakeAsync(() => {
    const enabled: boolean[] = [];
    const arrays: string[][] = [];
    variationSpy.and.callFake((feature: string) => feature === 'enabled' ? true : ['value']);
    service.isEnabled('enabled').subscribe((value) => enabled.push(value));
    service.getArray<string>('array').subscribe((value) => arrays.push(value));

    (service as any).ready.next(true);
    flushMicrotasks();

    expect(enabled).toEqual([false, true]);
    expect(arrays).toEqual([[], ['value']]);
  }));
});
