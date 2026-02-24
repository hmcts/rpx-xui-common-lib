import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TaskNameModel } from '../../models/task-name.model';
import { SessionStorageService } from '../storage/session-storage/session-storage.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let sessionStorageService: jasmine.SpyObj<SessionStorageService>;

  beforeEach(() => {
    const spySessionStorageService = jasmine.createSpyObj('SessionStorageService', ['getItem', 'setItem']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaskService,
        { provide: SessionStorageService, useValue: spySessionStorageService }
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorageService = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve task names from session storage', () => {
    const mockTaskNames: TaskNameModel[] = [
      { taskId: 111, taskName: 'Task Name' },
      { taskId: 222, taskName: 'Task Name 2' }
    ];
    const serviceTaskTypeKey = 'testService-taskNames';
    sessionStorageService.getItem.and.returnValue(JSON.stringify(mockTaskNames));
    const result = service.getTaskName('testService');
    result.subscribe(taskNames => {
      expect(taskNames).toEqual(mockTaskNames);
      expect(sessionStorageService.getItem).toHaveBeenCalledWith(serviceTaskTypeKey);
    });
  });

  it('should retrieve task names from the server', () => {
    const mockTaskNames: TaskNameModel[] = [
      {taskId: 111, taskName: 'Task Name'},
      {taskId: 222, taskName: 'Task Name 2'}
    ];
    const serviceTaskTypeKey = 'testService-taskNames';
    const mockResponse = mockTaskNames;
    sessionStorageService.getItem.and.returnValue(null);
    const result = service.getTaskName('testService');
    result.subscribe(taskNames => {
      expect(taskNames).toEqual(mockTaskNames);
      expect(sessionStorageService.setItem).toHaveBeenCalledWith(serviceTaskTypeKey, JSON.stringify(mockTaskNames));
    });

    const req = httpMock.expectOne('/workallocation/taskNames');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({service: 'testService'});
    req.flush(mockResponse);
  });
});
