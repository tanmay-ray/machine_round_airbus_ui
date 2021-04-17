import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hide = true;
  hideConfirmPass = true;
  registerError = false
  registerForm: FormGroup;
  confirmPass: FormControl;
  maxDate = new Date();

  passwordPatternValidators = [
    Validators.pattern(/^[A-Za-z0-9!@#$]{8,}$/),
    Validators.pattern(/[A-Z]/),
    Validators.pattern(/[a-z]/),
    Validators.pattern(/[0-9]/),
    Validators.pattern(/[!@#$]/),
  ];

  confirmPassValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) return null;
    else if (control.value === this.registerForm.value?.password) return null;
    else return { confirmPwdMatch: true };
  }

  emailValidator: AsyncValidatorFn = (control: AbstractControl) => {
    return this.authService.isValidEmail(control.value).pipe(map(valid => valid ? null : { duplicateEmail: true }));
  }

  passwordMsg = `Password must be alteast 8 characters long having only alphanumeric 
  characters and special characters (!,@,#,$). It must have atleast one of each characters
  out of lower case, upper case characters, digits and allowed special characters.`;

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
      password: new FormControl('', [Validators.required, ...this.passwordPatternValidators]),
      email: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailValidator]
      })
    });

    this.confirmPass = new FormControl('', [Validators.required, this.confirmPassValidator]);
  }

  createUser() {
    this.registerError = false;
    this.authService.createUser(this.registerForm.value).pipe(catchError(err => {
      console.error(err);
      this.registerError = true;
      return EMPTY;
    })).subscribe(() => {
      const loggedInUser = this.authService.getLoggedInUser();
      this.router.navigate([loggedInUser?.isAdmin ? 'users' : 'user']);
    });
  }

}
