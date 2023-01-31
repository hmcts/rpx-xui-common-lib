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
      return this.filterSettings[id];
    }
    if (sessionStorage.getItem(id)) {
      return JSON.parse(window.sessionStorage.getItem(id));
    }
    if (localStorage.getItem(id)) {
      if (this.isSameUser(id)) {
        return JSON.parse(window.localStorage.getItem(id));
      } else {
        return null;
      }
    }
    return null;
  }

  public isSameUser(id: string): boolean {
    const filterSetting: FilterSetting = JSON.parse(window.localStorage.getItem(id));
    return !!filterSetting.idamId && filterSetting.idamId === this.getUserId();
  }

  public getStream(id: string): Observable<FilterSetting> {
    if (!this.streams[id]) {
      this.streams[id] = new BehaviorSubject<FilterSetting>(this.get(id));
    }
    return this.streams[id].asObservable();
  }

  private persistLocal(setting: FilterSetting): void {
    setting.idamId = this.getUserId();
    window.localStorage.setItem(setting.id, JSON.stringify(setting));
  }

  private persistSession(setting: FilterSetting): void {
    window.sessionStorage.setItem(setting.id, JSON.stringify(setting));
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
