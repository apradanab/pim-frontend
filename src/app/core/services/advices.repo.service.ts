import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Advice } from '../../models/advice.model';

@Injectable({
  providedIn: 'root'
})
export class AdvicesRepoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/advices`;
  private readonly therapiesUrl = `${environment.apiUrl}/therapies`

  getAllAdvices(): Observable<Advice[]> {
    return this.http.get<Advice[]>(this.url);
  }

  getAdviceById(id: string): Observable<Advice> {
    return this.http.get<Advice>(`${this.url}/${id}`);
  }

  getAdvicesByTherapyId(therapyId: string): Observable<Advice[]> {
    return this.http.get<Advice[]>(`${this.therapiesUrl}/${therapyId}/advices`);
  }

  createAdvice(advice: Advice): Observable<Advice> {
    return this.http.post<Advice>(`${this.therapiesUrl}/${advice.therapyId}/advices`, advice);
  }
}
