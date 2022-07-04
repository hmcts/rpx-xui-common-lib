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
   * @param searchTerm: any search term for task name.
   * @return Observable<LocationByEPIMMSModel[]>: Array of taskName in Observable
   */
  public getTaskName(searchTerm: string): Observable<any[]> {
    console.log(searchTerm);

    return this.http.get<any[]>(`/workallocation2/taskNames`);
  }
}
