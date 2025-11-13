import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Advice } from '../../../models/advice.model';

@Injectable({
  providedIn: 'root'
})
export class AdvicesRepoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/advices`;
  private readonly therapiesUrl = `${environment.apiUrl}/therapies`

  listAdvices(): Observable<Advice[]> {
    return this.http.get<Advice[]>(this.url);
  }

  getAdvice(id: string): Observable<Advice> {
    return this.http.get<Advice>(`${this.url}/${id}`);
  }

  listAdvicesByTherapy(therapyId: string): Observable<Advice[]> {
    return this.http.get<Advice[]>(`${this.therapiesUrl}/${therapyId}/advices`);
  }

  createAdvice(advice: Advice): Observable<Advice> {
    return this.http.post<Advice>(`${this.therapiesUrl}/${advice.therapyId}/advices`, advice);
  }

  updateAdvice(id: string, advice: Partial<Advice>): Observable<Advice> {
    const therapyId = advice.therapyId;
    return this.http.patch<Advice>(`${this.therapiesUrl}/${therapyId}/advices/${id}`, advice);
  }

  deleteAdvice(id: string, therapyId: string): Observable<void> {
    return this.http.delete<void>(`${this.therapiesUrl}/${therapyId}/advices/${id}`);
  }
}
