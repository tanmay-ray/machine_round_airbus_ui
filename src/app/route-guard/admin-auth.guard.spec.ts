import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../authentication/auth.service';

import { AdminAuthGuard } from './admin-auth.guard';

class AuthServiceMock {
  getLoggedInUser() { return null; }
}

describe('AdminAuthGuard', () => {
  let authSpy: jasmine.Spy;
  let guard: AdminAuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }]
    });
    guard = TestBed.inject(AdminAuthGuard);
    router = TestBed.inject(Router);
    authSpy = spyOn(TestBed.inject(AuthService), 'getLoggedInUser').and.callThrough();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow if user is not logged in', () => {
    expect(guard.canActivate({} as any, {} as any)).toEqual(router.createUrlTree(['unauthorized']));
  });

  it('should not allow a logged in user if they are not admin', () => {
    authSpy.and.returnValue({ isAdmin: false });
    expect(guard.canActivate({} as any, {} as any)).toEqual(router.createUrlTree(['unauthorized']));
  });

  it('should allow a logged in user if they are admin', () => {
    authSpy.and.returnValue({ isAdmin: true });
    expect(guard.canActivate({} as any, {} as any)).toBe(true);
  });
});
