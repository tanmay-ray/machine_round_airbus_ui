import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggedInUser = this.authService.getLoggedInUser();
    next.data = { loggedInUser };
    if(next.queryParams?.user && loggedInUser && !loggedInUser.isAdmin) {
      return this.router.createUrlTree(['unauthorized']);
    }
    return !!loggedInUser || this.router.createUrlTree(['unauthorized']);
  }

}
