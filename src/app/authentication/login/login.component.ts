import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  email: string;
  password: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['user'], { state: { userId: 1 } });
  }

}
