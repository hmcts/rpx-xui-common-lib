import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonLibraryModuleConfig {
    private plaunchDarklyClientId: string;
    public get launchDarklyClientId(): string {
        return this.plaunchDarklyClientId;
    }
    public set launchDarklyClientId(value: string) {
        this.plaunchDarklyClientId = value;
        this.plaunchDarklyClientId$.next(value);
    }

    private readonly plaunchDarklyClientId$ = new BehaviorSubject<string>('');
    public get launchDarklyClientId$(): Observable<string> {
        return this.plaunchDarklyClientId$.asObservable();
    }
}
