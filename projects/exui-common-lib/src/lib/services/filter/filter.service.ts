import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterPersistence, FilterSetting } from '../../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private readonly filterSettings: { [id: string]: FilterSetting } = {};
  private readonly streams: { [id: string]: BehaviorSubject<FilterSetting> } = {};

  constructor() {}

  public persist(setting: FilterSetting, persistence: FilterPersistence) {
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
      return JSON.parse(window.localStorage.getItem(id));
    }
    return null;
  }

  public getStream(id: string): Observable<FilterSetting> {
    if (!this.streams[id]) {
      this.streams[id] = new BehaviorSubject<FilterSetting>(this.get(id));
    }
    return this.streams[id].asObservable();
  }

  private persistLocal(setting: FilterSetting) {
    window.localStorage.setItem(setting.id, JSON.stringify(setting));
  }

  private persistSession(setting: FilterSetting) {
    window.sessionStorage.setItem(setting.id, JSON.stringify(setting));
  }

  private persistMemory(setting: FilterSetting) {
    this.filterSettings[setting.id] = setting;
  }

  private updateStreams(setting: FilterSetting) {
    if (this.streams[setting.id]) {
      this.streams[setting.id].next(setting);
    }
  }
}