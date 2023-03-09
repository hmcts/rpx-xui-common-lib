import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
import { TaskNameModel } from '../../models/task-name.model';
import { SessionStorageService } from '../storage/session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskNameService {
  public static taskNamesKey: string = 'taskNames';

  constructor(private readonly http: HttpClient, private readonly sessionStorageService: SessionStorageService) {
  }

  /**
   * @return Observable<any[]>: Array of taskName in Observable
   */
  public getTaskName(service: string): Observable<TaskNameModel[]> {
    const serviceTaskTypeKey = `${service}-${TaskNameService.taskNamesKey}`;
    if (this.sessionStorageService.getItem(serviceTaskTypeKey)) {
      const taskNames = JSON.parse(this.sessionStorageService.getItem(serviceTaskTypeKey));
      return of(taskNames as TaskNameModel[]);
    }
    return this.http.post<TaskNameModel[]>(`/workallocation/taskNames`, {service}).pipe(
      tap(taskNames => this.sessionStorageService.setItem(serviceTaskTypeKey, JSON.stringify(taskNames)))
    );
  }
}
