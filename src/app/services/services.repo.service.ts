import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Service } from '../models/service.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesRepoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/services`;


  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.url).pipe(
      catchError(() => {
        return throwError(() => new Error('Service error'));
      })
    );
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.url}/${id}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.url, service);
  }

  updateService(id: string, service: Partial<Service>): Observable<Service> {
    return this.http.patch<Service>(`${this.url}/${id}`, service);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`)
  }
}
