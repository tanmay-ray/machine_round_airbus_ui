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
  private _loggedUser$ = new BehaviorSubject<{ email: string, isAdmin: boolean } | null>(null);

  constructor(private httpClient: HttpClient) { }

  private setSession(jwt: string) {
    sessionStorage.setItem("jwt", jwt);
  }

  private setLoggedUser() {
    const jwt = sessionStorage.getItem("jwt");
    let user = null;
    if (jwt) {
      user = JSON.parse(atob(jwt.split('.')[1]));
      const isAdmin = (user?.auth as any[] || []).some(auth => auth?.authority === 'ADMIN');
      user = { email: user.sub, isAdmin };
    }

    this._loggedUser$.next(user);
  }

  private reqPostProcessor(res: Observable<UserAuthResponse>) {
    return res.pipe(tap(({ jwt }) => {
      this.setSession(jwt);
      this.setLoggedUser();
    }));
  }

  createUser(user: NewUser) {
    const url = `${this.baseUrl}/register`;
    return this.reqPostProcessor(this.httpClient.post<UserAuthResponse>(url, user));

  }

  authenticate(user: UserAuth) {
    const url = `${this.baseUrl}/authenticate`;
    return this.reqPostProcessor(this.httpClient.post<UserAuthResponse>(url, user));
  }

  logOut() {
    sessionStorage.removeItem('jwt');
    this.setLoggedUser();
  }

  getLoggedInUser() { return this._loggedUser$.asObservable(); }
}
