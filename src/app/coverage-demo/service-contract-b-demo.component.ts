import { Component } from '@angular/core';
import { HttpBackend, HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { LocationByEPIMMSModel, RefDataHMCTSService, RefDataRegion } from 'projects/exui-common-lib/src/public-api';
import { TaskNameModel } from 'projects/exui-common-lib/src/lib/models/task-name.model';
import { RefDataDataAccessService } from 'projects/exui-common-lib/src/lib/services/ref-data/ref-data-data-access/ref-data-data-access.service';
import { RefDataService } from 'projects/exui-common-lib/src/lib/services/ref-data/ref-data.service';
import { SessionStorageService } from 'projects/exui-common-lib/src/lib/services/storage/session-storage/session-storage.service';
import { TaskService } from 'projects/exui-common-lib/src/lib/services/task/task.service';
import { HttpGlobalInterceptor } from 'projects/exui-common-lib/src/lib/services/http-global-interceptors/http-global-interceptor';

class ServiceContractBInterceptorHandler implements HttpHandler {
  constructor(private readonly backend: HttpBackend, private readonly interceptor: HttpInterceptor) {}

  public handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    return this.interceptor.intercept(request, this.backend);
  }
}

@Component({
  selector: 'app-service-contract-b-demo',
  templateUrl: './service-contract-b-demo.component.html',
  standalone: false
})
export class ServiceContractBDemoComponent {
  public referenceDataState = 'idle';
  public referenceDataError = '';
  public referenceDataRegions: RefDataRegion[] = [];
  public referenceDataServices: RefDataHMCTSService[] = [];
  public referenceDataLocations: LocationByEPIMMSModel[] = [];
  public locationsState = 'idle';
  public locationsError = '';
  public locations: LocationByEPIMMSModel[] = [];
  public multiCodeLocations: LocationByEPIMMSModel[] = [];
  public taskNamesState = 'idle';
  public taskNamesError = '';
  public taskNames: TaskNameModel[] = [];
  public interceptorState = 'idle';
  public interceptorError = '';

  private readonly refData: RefDataService;
  private readonly taskService: TaskService;
  private readonly sessionStorage: SessionStorageService;
  private readonly http: HttpClient;

  constructor(httpBackend: HttpBackend) {
    this.http = new HttpClient(new ServiceContractBInterceptorHandler(httpBackend, new HttpGlobalInterceptor()));
    this.sessionStorage = new SessionStorageService();
    this.refData = new RefDataService(new RefDataDataAccessService(this.http));
    this.taskService = new TaskService(this.http, this.sessionStorage);
  }

  public loadReferenceData(): void {
    this.referenceDataState = 'loading';
    forkJoin({
      regions: this.refData.regions$.pipe(take(1)),
      services: this.refData.services$.pipe(take(1)),
      locations: this.refData.locations$.pipe(take(1))
    }).pipe(
      catchError(() => of(null))
    ).subscribe((value) => {
      if (!value) {
        this.referenceDataState = 'error';
        this.referenceDataError = 'Reference data request failed';
        return;
      }
      this.referenceDataRegions = value.regions;
      this.referenceDataServices = value.services;
      this.referenceDataLocations = value.locations;
      this.referenceDataState = 'ready';
    });
  }

  public loadLocations(): void {
    this.loadLocationsFor(['IA'], 'locations');
  }

  public loadLocationsForMultipleServices(): void {
    this.loadLocationsFor(['IA', 'UNKNOWN'], 'multiCodeLocations');
  }

  private loadLocationsFor(serviceCodes: string[], target: 'locations' | 'multiCodeLocations'): void {
    this.locationsState = 'loading';
    this.refData.getLocationsByServiceCodes(serviceCodes).subscribe({
      next: (value) => {
        this[target] = value; this.locationsState = 'ready';
      },
      error: (error) => {
        this.locationsState = 'error'; this.locationsError = this.errorMessage(error, 'Location request failed');
      }
    });
  }

  public loadTaskNames(): void {
    this.taskNamesState = 'loading';
    this.taskService.getTaskName('IA').subscribe({
      next: (value) => {
        this.taskNames = value; this.taskNamesState = 'ready';
      },
      error: (error) => {
        this.taskNamesState = 'error'; this.taskNamesError = this.errorMessage(error, 'Task-name lookup failed');
      }
    });
  }

  public clearTaskCache(): void {
    this.sessionStorage.removeItem('IA-taskNames');
  }

  public get regionNames(): string {
    return this.referenceDataRegions.map((region) => region.description).join(', ');
  }

  public get serviceNames(): string {
    return this.referenceDataServices.map((service) => service.service_description).join(', ');
  }

  public get referenceLocationNames(): string {
    return this.referenceDataLocations.map((location) => location.site_name).join(', ');
  }

  public get locationNames(): string {
    return this.locations.map((location) => location.site_name).join(', ');
  }

  public get multiCodeLocationNames(): string {
    return this.multiCodeLocations.map((location) => location.site_name).join(', ');
  }

  public get taskNameValues(): string {
    return this.taskNames.map((task) => task.taskName).join(', ');
  }

  public requestInterceptorError(): void {
    this.interceptorState = 'loading';
    this.http.get('/service-contract-b/interceptor').subscribe({
      next: () => {
        this.interceptorState = 'ready';
      },
      error: (error) => {
        this.interceptorState = 'error';
        this.interceptorError = this.errorMessage(error, 'Request failed');
      }
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return typeof error === 'string' && error ? error : fallback;
  }
}
