import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterError, FilterPersistence, FilterSetting} from '../../models';

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

  public clearStream(id: string) {
    if (window.sessionStorage.getItem(id)) {
      window.sessionStorage.removeItem(id);
    }
    if (window.localStorage.getItem(id)) {
      window.localStorage.removeItem(id);
    }
    this.givenErrors.next(null);
    delete this.streams[id];
  }

  private persistLocal(setting: FilterSetting): void {
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
}
