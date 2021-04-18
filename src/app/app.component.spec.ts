import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './authentication/auth.service';

class MockAuthService {
  logout() { }
  getLoggedInUser() { return { email: 'someone@gmail.com', isAdmin: false }; }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should logout the user and navigate to home page', () => {
    const spy = spyOn(authService, 'logout');
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.logout()

    expect(spy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should display logout button to logged in users', () => {
    expect(fixture.debugElement.query(By.css('.sign-out'))).toBeTruthy();
  });

  it('should not display logout button to logged out users', () => {
    spyOn(authService, 'getLoggedInUser').and.returnValue(undefined);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.sign-out'))).toBeFalsy();
  });
});
