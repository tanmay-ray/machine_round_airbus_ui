import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NewUser } from '../model/new-user.model';
import { UserAuth } from '../model/user-auth.model';

interface UserAuthResponse {
  jwt: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  private setLoggedInUser(jwt: string) {
    sessionStorage.setItem("jwt", jwt);
  }

  createUser(user: NewUser) {
    const url = `${this.baseUrl}/register`;
    return this.httpClient.post<UserAuthResponse>(url, user)
      .pipe(tap(({ jwt }) => this.setLoggedInUser(jwt)));

  }

  authenticate(user: UserAuth) {
    const url = `${this.baseUrl}/authenticate`;
    return this.httpClient.post<UserAuthResponse>(url, user)
      .pipe(tap(({ jwt }) => this.setLoggedInUser(jwt)));
  }

  getLoggedInUser() {
    const jwt = sessionStorage.getItem('jwt');
    let user;
    if (jwt) {
      user = JSON.parse(atob(jwt.split('.')[1]));
      const isAdmin = (user?.auth as any[] || []).some(auth => auth?.authority === 'ADMIN');
      user = { email: user.sub, isAdmin };
    }
    return user;
  }

  logOut() {
    sessionStorage.removeItem('jwt');
  }
}
