import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { UpdateUserInput, User, UserCreateDto, UserLoginDto } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersRepoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/users`;
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly adminUrl = `${environment.apiUrl}/admin/users`

  preregister(data: UserCreateDto): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, data);
  }

  login(data:UserLoginDto): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.authUrl}/login`, data);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  updateUser(id: string, data: UpdateUserInput): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}`, data);
  }

  completeRegistration(data: {
    registrationToken: string;
    password: string;
    email: string;
    name?: string;
    avatarKey?: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.authUrl}/complete-registration`,
      data
    );
  }

  approveUser(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.adminUrl}/${userId}/approve`, {});
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${userId}`);
  }
}
