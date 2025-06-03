import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Resource } from '../../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourcesRepoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/resources`;

  getAllResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.url);
  }

  getResourceById(id: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.url}/${id}`);
  }

  getResourcesByServiceId(serviceId: string): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.url}/service/${serviceId}`);
  }
}
