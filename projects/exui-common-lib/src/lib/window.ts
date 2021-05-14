import { InjectionToken } from '@angular/core';

export const windowToken = new InjectionToken<Window>('Window', { providedIn: 'root', factory: windowProvider });
export function windowProvider() { return window; }
