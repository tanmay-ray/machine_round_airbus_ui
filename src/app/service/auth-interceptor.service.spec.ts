import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authentication/auth.service';
import { UserAuth } from '../model/user-auth.model';
import { UserService } from '../user/user.service';

import { AuthInterceptorService } from './auth-interceptor.service';

describe('AuthInterceptorService', () => {
  let userService: UserService;
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.Spy;
  const baseUrl = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
      ],
    });
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    storageSpy = spyOn(Storage.prototype, 'getItem').and.returnValue(null);
  });

  it('should forward requests as it is when jwt Token not present (user is logging in or registering)', () => {
    authService.authenticate({} as UserAuth).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/authenticate`);
    expect(req.request.headers.has('Authorization')).toBe(false);
  });

  it('should add an Authorization header to requests when jwt Token present (user is logged in)', () => {
    storageSpy.and.returnValue('jwt_token');
    userService.getUserList().subscribe();
    const req = httpMock.expectOne(`${baseUrl}/users`);
    expect(req.request.headers.has('Authorization')).toBe(true);
  });

});
