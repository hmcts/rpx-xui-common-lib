import { InjectionToken } from '@angular/core';

export const windowToken = new InjectionToken('Window');
export function windowProvider() { return window; }
