import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { NewUser } from '../model/new-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  createUser(user: NewUser) {
    return this.httpClient.post('http://localhost:8080/user', user, { responseType: 'text' })
      .pipe(map(userId => +userId));
  }
}
