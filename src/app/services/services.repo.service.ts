import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Service } from '../models/service.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesRepoService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/services';

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.url);
  }
}
