import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
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
  public getTaskName(): Observable<any[]> {
    if (this.sessionStorageService.getItem(TaskNameService.taskNamesKey)) {
      const taskNames = JSON.parse(this.sessionStorageService.getItem(TaskNameService.taskNamesKey));
      return of(taskNames as any[]);
    }
    return this.http.get<any[]>(`/workallocation/taskNames`).pipe(
      tap(taskNames => this.sessionStorageService.setItem(TaskNameService.taskNamesKey, JSON.stringify(taskNames)))
    );
  }
}
