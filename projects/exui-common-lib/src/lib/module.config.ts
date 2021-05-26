import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CommonLibraryModuleConfig {
    private _launchDarklyClientId: string;
    public get launchDarklyClientId(): string {
        return this._launchDarklyClientId;
    }
    public set launchDarklyClientId(value: string) {
        this._launchDarklyClientId = value;
        this._launchDarklyClientId$.next(value);
    }

    private _launchDarklyClientId$ = new BehaviorSubject<string>('');
    public get launchDarklyClientId$(): Observable<string> {
        return this._launchDarklyClientId$.asObservable();
    }
}
