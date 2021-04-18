import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to fetch user details', () => {
    const email = 'someone@gmail.com';
    const url = `${baseUrl}/user/${email}`;
    service.getUser(email).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });

  it('should send a GET request to fetch all users', () => {
    const url = `${baseUrl}/users`;
    service.getUserList().subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
  });
});
