import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  email: string;
  password: string;
  loginError = false;

  constructor(private router: Router, private authService: AuthService) { }

  login() {
    this.loginError = false;
    this.authService.authenticate({ email: this.email, password: this.password }).pipe(catchError(err => {
      console.error(err);
      this.loginError = true;
      return EMPTY;
    })).subscribe(() => {
      const loggedInUser = this.authService.getLoggedInUser();
      this.router.navigate([loggedInUser?.isAdmin ? 'users' : 'user']);
    });
  }

}
