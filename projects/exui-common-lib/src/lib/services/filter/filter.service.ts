import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterError, FilterPersistence, FilterSetting } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public givenErrors: BehaviorSubject<FilterError[]> = new BehaviorSubject(null);
  public isInitialSetting: boolean = false;
  private readonly filterSettings: { [id: string]: FilterSetting } = {};
  private readonly streams: { [id: string]: BehaviorSubject<FilterSetting> } = {};

  public persist(setting: FilterSetting, persistence: FilterPersistence): void {
    setting = { ...setting };
    delete (setting as FilterSetting & { idamId?: string }).idamId;
    switch (persistence) {
      case 'local':
        this.persistLocal(setting);
        break;
      case 'session':
        this.persistSession(setting);
        break;
      default:
        break;
    }
    this.persistMemory(setting);
    this.updateStreams(setting);
  }

  public get(id: string): FilterSetting | null {
    if (this.filterSettings[id]) {
      const setting = this.filterSettings[id];
      return !setting.ownerHash || this.isSameUser(setting) ? setting : null;
    }
    const localSetting = localStorage.getItem(id);
    if (localSetting) {
      const setting: FilterSetting = JSON.parse(localSetting);
      if (this.isSameUser(setting)) {
        // A legacy session entry must not override the restored local filter.
        sessionStorage.removeItem(id);
        return setting;
      }
      localStorage.removeItem(id);
    }
    const sessionSetting = sessionStorage.getItem(id);
    if (sessionSetting) {
      return JSON.parse(sessionSetting);
    }
    return null;
  }

  private isSameUser(setting: FilterSetting): boolean {
    const ownerHash = this.getOwnerHash();
    return !!ownerHash && setting.ownerHash === ownerHash;
  }

  private getOwnerHash(): string | undefined {
    const userInfoStr = window.sessionStorage.getItem('userDetails');
    return userInfoStr ? JSON.parse(userInfoStr).filterOwnerHash : undefined;
  }

  public getStream(id: string): Observable<FilterSetting> {
    if (!this.streams[id]) {
      this.streams[id] = new BehaviorSubject<FilterSetting>(this.get(id));
    }
    return this.streams[id].asObservable();
  }

  public clearSessionAndLocalPersistance(id: string) {
    sessionStorage.removeItem(id);
    localStorage.removeItem(id);
    if (this.filterSettings[id] !== undefined) {
      this.filterSettings[id] = null;
    }
    if (this.streams[id] !== undefined) {
      this.streams[id].next(null);
    }
  }

  private persistLocal(setting: FilterSetting): void {
    const ownerHash = this.getOwnerHash();
    if (!ownerHash) {
      // Without an owner reference, retain selections only in this session.
      delete setting.ownerHash;
      this.persistSession(setting);
      return;
    }
    setting.ownerHash = ownerHash;
    window.localStorage.setItem(setting.id, JSON.stringify(setting));
    sessionStorage.removeItem(setting.id);
  }

  private persistSession(setting: FilterSetting): void {
    sessionStorage.setItem(setting.id, JSON.stringify(setting));
    localStorage.removeItem(setting.id);
  }

  private persistMemory(setting: FilterSetting): void {
    this.filterSettings[setting.id] = setting;
  }

  private updateStreams(setting: FilterSetting): void {
    if (this.streams[setting.id]) {
      this.streams[setting.id].next(setting);
    }
  }

  public getUserId(): string {
    const userInfoStr = window.sessionStorage.getItem('userDetails');
    let userId: string;
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      userId = userInfo.id ? userInfo.id : userInfo.uid;
    }
    return userId;
  }
}
