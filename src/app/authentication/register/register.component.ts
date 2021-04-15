import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hide = true;
  hideConfirmPass = true;
  registerForm: FormGroup;
  confirmPass: FormControl;
  maxDate = new Date();
  passwordMsg = 'Password must be alteast 8 characters long having only alphanumeric characters and special characters (!,@,#,$). It must have atleast one lower and one upper case characters and atleast one digit.';

  constructor(private authService: AuthService, private router: Router) {
    this.createRegistrationForm();
  }

  ngOnInit(): void {
  }

  createRegistrationForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      phone: new FormControl(''),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required])
    });

    this.confirmPass = new FormControl('', [Validators.required]);
  }

  createUser() {
    this.authService.createUser(this.registerForm.value).subscribe(
      userId => this.router.navigate(['user'], { state: { userId } })
    );
  }

}