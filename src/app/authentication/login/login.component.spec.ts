import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UserAuth } from 'src/app/model/user-auth.model';
import { AuthService } from '../auth.service';

import { LoginComponent } from './login.component';

class AuthServiceMock {
  getLoggedInUser() { return { isAdmin: false }; }
  authenticate(user: UserAuth) { return of({}); }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginSpy: jasmine.Spy;
  let userSpy: jasmine.Spy;
  let routerSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    loginSpy = spyOn(TestBed.inject(AuthService), 'authenticate').and.callThrough();
    userSpy = spyOn(TestBed.inject(AuthService), 'getLoggedInUser').and.callThrough();
    routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    component.email = "someone@gmail.com";
    component.password = "qwerty";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message on login failure', () => {
    component.loginError = false;
    loginSpy.and.returnValue(throwError('error'));
    component.login()
    expect(component.loginError).toBeTrue();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should navigate to user details page on successful login, if user is a regular user', () => {
    component.login();
    expect(routerSpy).toHaveBeenCalledWith(['user']);
  });

  it('should navigate to user list page on successful login, if user is an admin user', () => {
    userSpy.and.returnValue({ isAdmin: true });
    component.login();
    expect(routerSpy).toHaveBeenCalledWith(['users']);
  });
});
