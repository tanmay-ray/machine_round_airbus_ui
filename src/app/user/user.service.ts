import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getUser(email: string) {
    return this.httpClient.get<User>(`${this.baseUrl}/user/${email}`);
  }

  getUserList() {
    return this.httpClient.get<User[]>(`${this.baseUrl}/users`);
  }
}
