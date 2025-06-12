import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Therapy } from '../../models/therapy.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TherapiesRepoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/services`;

  getTherapies(): Observable<Therapy[]> {
    return this.http.get<Therapy[]>(this.url)
  }

  getTherapyById(id: string): Observable<Therapy> {
    return this.http.get<Therapy>(`${this.url}/${id}`);
  }

  createTherapy(therapy: Therapy): Observable<Therapy> {
    return this.http.post<Therapy>(this.url, therapy);
  }

  updateTherapy(id: string, therapy: Partial<Therapy>): Observable<Therapy> {
    return this.http.patch<Therapy>(`${this.url}/${id}`, therapy);
  }

  deleteTherapy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`)
  }
}
