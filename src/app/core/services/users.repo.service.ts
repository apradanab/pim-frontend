import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { User, UserCreateDto, UserLoginDto } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersRepoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/users`;

  preregister(data: UserCreateDto): Observable<User> {
    return this.http.post<User>(`${this.url}/create`, data);
  }

  login(data:UserLoginDto): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.url}/login`, data);
  }

  completeRegistration(token: string, password: string): Observable<User> {
    return this.http.patch<User>(`${this.url}/complete-registration`, { token, password });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }
}
