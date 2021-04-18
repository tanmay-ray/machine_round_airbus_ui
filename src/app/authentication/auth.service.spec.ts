import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.Spy;
  const baseUrl = environment.baseUrl;
  const storage = Storage.prototype;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    storageSpy = spyOn(storage, 'setItem');
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to check email validity', () => {
    const email = 'someone@gmail.com';
    const url = `${baseUrl}/is-valid-email/${email}`;
    service.isValidEmail(email).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });

  it('should send a POST request to authenticate user', () => {
    const url = `${baseUrl}/authenticate`;
    const user = { email: 'abcd@xyz.com', password: 'qwerty' };
    const jwt = 'jwt_token';
    service.authenticate(user).subscribe();

    const req = httpMock.expectOne(url);
    req.flush({ jwt });

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(user);
    expect(storageSpy).toHaveBeenCalledWith('jwt', jwt);
  });

  it('should send a POST request to create user', () => {
    const url = `${baseUrl}/register`;
    const jwt = 'jwt_token';
    const user = {
      name: 'John Doe',
      dob: new Date(),
      email: 'john.doe@gmail.com',
      gender: 'Male',
      phone: 7788665544,
      password: 'Qwerty@123'
    };
    service.createUser(user).subscribe();

    const req = httpMock.expectOne(url);
    req.flush({ jwt });

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(user);
    expect(storageSpy).toHaveBeenCalledWith('jwt', jwt);
  });

  it('should clear jwt token from session storage on logout', () => {
    const spy = spyOn(storage, 'removeItem');
    service.logout();
    expect(spy).toHaveBeenCalled();
  });

  it('should fetch and parse jwt token from storage, when no jwt token present', () => {
    spyOn(storage, 'getItem').and.returnValue(null);
    expect(service.getLoggedInUser()).toBeUndefined();
  });

  it('should fetch and parse jwt token from storage, when user is a regular user', () => {
    const user = { sub: 'someone@gmail.com', auth: [{ authority: 'GENERAL' }] };
    const jwt = `header.${btoa(JSON.stringify(user))}.signature`;
    spyOn(storage, 'getItem').and.returnValue(jwt);
    expect(service.getLoggedInUser()).toEqual({ email: user.sub, isAdmin: false });
  });

  it('should fetch and parse jwt token from storage, when user is an admin', () => {
    const user = { sub: 'someone@gmail.com', auth: [{ authority: 'ADMIN' }] };
    const jwt = `header.${btoa(JSON.stringify(user))}.signature`;
    spyOn(storage, 'getItem').and.returnValue(jwt);
    expect(service.getLoggedInUser()).toEqual({ email: user.sub, isAdmin: true });
  });
});
