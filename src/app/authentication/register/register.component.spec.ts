import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { NewUser } from 'src/app/model/new-user.model';
import { AuthService } from '../auth.service';

import { RegisterComponent } from './register.component';

class AuthServiceMock {
  createUser(user: NewUser) { return of({}); }
  isValidEmail(email: string) { return of(true); }
}

const mockUser: NewUser = {
  name: 'John Doe',
  dob: new Date(),
  email: 'john.doe@gmail.com',
  gender: 'Male',
  phone: 7788665544,
  password: 'Qwerty@123'
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let createSpy: jasmine.Spy;
  let validEmailSpy: jasmine.Spy;
  let routerSpy: jasmine.Spy;

  const getRegisterBtn = () => {
    fixture.detectChanges();
    return fixture.debugElement.query(By.css('.register-btn')).nativeElement as HTMLButtonElement;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, MatRadioModule],
      declarations: [RegisterComponent],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    createSpy = spyOn(TestBed.inject(AuthService), 'createUser').and.callThrough();
    validEmailSpy = spyOn(TestBed.inject(AuthService), 'isValidEmail').and.callThrough();
    routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    component.registerForm.setValue(mockUser);
    component.confirmPass.setValue('Qwerty@123');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.registerForm).toBeTruthy();
    expect(component.confirmPass).toBeTruthy();
  });

  it('should display error message on login failure', () => {
    component.registerError = false;
    createSpy.and.returnValue(throwError('error'));
    component.createUser()
    expect(component.registerError).toBeTrue();
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should navigate to user details page on successful login', () => {
    component.createUser();
    expect(routerSpy).toHaveBeenCalledWith(['user']);
  });

  it('should allow create if valid form and confirm password matches', () => {
    expect(component.registerForm.valid).toBeTrue();
    expect(component.confirmPass.valid).toBeTrue();
    expect(getRegisterBtn().disabled).toBeFalse();
  });

  it('should not allow create if confirm password doesn\'t match', () => {
    component.confirmPass.setValue('different');
    expect(component.confirmPass.valid).toBeFalse();
    expect(getRegisterBtn().disabled).toBeTrue();
  });

  it('should not allow create if invalid form', () => {
    component.registerForm.patchValue({ name: '' });
    expect(component.registerForm.valid).toBeFalse();
    expect(getRegisterBtn().disabled).toBeTrue();
  });

  it('should not allow create if invalid form and confirm password doesn\'t match', () => {
    component.registerForm.patchValue({ name: '' });
    component.confirmPass.setValue('different');
    expect(component.confirmPass.valid).toBeFalse();
    expect(component.registerForm.valid).toBeFalse();
    expect(getRegisterBtn().disabled).toBeTrue();
  });

  describe('Registration form validations', () => {

    afterEach(() => {
      expect(component.registerForm.valid).toBeFalse();
      expect(getRegisterBtn().disabled).toBeTrue();
    });

    it('confirmPass is required', () => {
      component.registerForm.patchValue({ email: '' });
      component.confirmPass.setValue('');
      expect(component.confirmPass.valid).toBeFalse();
    });

    it('name is required', () => component.registerForm.patchValue({ name: '' }));
    it('dob is required', () => component.registerForm.patchValue({ dob: '' }));
    it('gender is required', () => component.registerForm.patchValue({ gender: '' }));
    it('password is required', () => component.registerForm.patchValue({ password: '' }));
    it('email is required', () => component.registerForm.patchValue({ email: '' }));
    
    it('email pattern validation', () => component.registerForm.patchValue({ email: 'abcd.in' }));
    it('email is invalid', () => {
      validEmailSpy.and.returnValue(of(false));
      component.registerForm.patchValue({ email: 'abcd@xyz.in' });
    });

    it('password pattern validation', () => component.registerForm.patchValue({ password: '12345678' }));
    it('password pattern validation', () => component.registerForm.patchValue({ password: 'AQW324ER4' }));
    it('password pattern validation', () => component.registerForm.patchValue({ password: 'asd$wer45' }));
    it('password pattern validation', () => component.registerForm.patchValue({ password: 'aSD^wer45' }));
    it('password pattern validation', () => component.registerForm.patchValue({ password: 'ASd@45' }));
  });

});
