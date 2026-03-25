import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
import { TaskNameModel } from '../../models/task-name.model';
import { WorkType } from '../../models/work-type.model';
import { SessionStorageService } from '../storage/session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public static readonly WORK_ALLOCATION_API = '/workallocation';
  public static taskNamesKey: string = 'taskNames';

  constructor(private readonly http: HttpClient, private readonly sessionStorageService: SessionStorageService) {
  }

  /**
   * @return Observable<any[]>: Array of taskName in Observable
   */
  public getTaskName(service: string): Observable<TaskNameModel[]> {
    const serviceTaskTypeKey = `${service}-${TaskService.taskNamesKey}`;
    if (this.sessionStorageService.getItem(serviceTaskTypeKey)) {
      const taskNames = JSON.parse(this.sessionStorageService.getItem(serviceTaskTypeKey));
      return of(taskNames as TaskNameModel[]);
    }
    return this.http.post<TaskNameModel[]>(`${TaskService.WORK_ALLOCATION_API}/taskNames`, {service}).pipe(
      tap(taskNames => this.sessionStorageService.setItem(serviceTaskTypeKey, JSON.stringify(taskNames)))
    );
  }

  /**
   * @return Observable<any[]>: Array of work-type in Observable
   */
  // Note: Could pass service in here if needed
  public searchWorkTypes(term: string): Observable<WorkType[]> {
    // Note: Could get from session storage here if needed
    return this.http.post<WorkType[]>(`${TaskService.WORK_ALLOCATION_API}/task/search-types-of-work`, {searchTerm: term});
  }
}
