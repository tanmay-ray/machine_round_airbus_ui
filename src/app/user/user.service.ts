import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUser(email: string) {
    return this.httpClient.get<User>(`http://localhost:8080/user/${email}`);
  }

  getUserList() {
    return this.httpClient.get<User[]>(`http://localhost:8080/users`);
  }
}
