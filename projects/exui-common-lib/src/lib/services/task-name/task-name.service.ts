import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskNameService {

  constructor(private readonly http: HttpClient) {
  }

  /**
   * @return Observable<any[]>: Array of taskName in Observable
   */
  public getTaskName(): Observable<any[]> {
    return this.http.get<any[]>(`/workallocation2/taskNames`);
  }
}
