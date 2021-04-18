import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../authentication/auth.service';

import { UserAuthGuard } from './user-auth.guard';

class AuthServiceMock {
  getLoggedInUser() { return null; }
}

describe('AdminAuthGuard', () => {
  let authSpy: jasmine.Spy;
  let guard: UserAuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }]
    });
    guard = TestBed.inject(UserAuthGuard);
    router = TestBed.inject(Router);
    authSpy = spyOn(TestBed.inject(AuthService), 'getLoggedInUser').and.callThrough();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow if user is not logged in', () => {
    expect(guard.canActivate({} as any, {} as any)).toEqual(router.createUrlTree(['unauthorized']));
  });

  it('should add logged in user as null to data', () => {
    const snapshot = {} as any;
    guard.canActivate(snapshot, {} as any);
    expect(snapshot.data.loggedInUser).toBeNull();
  });

  describe('Logged in regular user', () => {
    let user = { email: 'someone@gmail.com', isAdmin: false };
    beforeEach(() => authSpy.and.returnValue(user));

    it('should add login info to data', () => {
      const snapshot = {} as any;
      guard.canActivate(snapshot, {} as any);
      expect(snapshot.data).toEqual({ loggedInUser: user });
    });

    it('should not allow if there are query params', () => {
      expect(guard.canActivate({ queryParams: { user: 'someone_else@gamil.com' } } as any, {} as any))
        .toEqual(router.createUrlTree(['unauthorized']));
    });

    it('should allow if there are no query params', () => {
      expect(guard.canActivate({} as any, {} as any)).toBeTrue();
    });
  });

  describe('Logged in admin user', () => {
    let user = { email: 'admin@gmail.com', isAdmin: true };
    beforeEach(() => authSpy.and.returnValue(user));

    it('should add login info to data', () => {
      const snapshot = {} as any;
      guard.canActivate(snapshot, {} as any);
      expect(snapshot.data).toEqual({ loggedInUser: user });
    });

    it('should allow if there are query params', () => {
      expect(guard.canActivate({ queryParams: { user: 'someone_else@gamil.com' } } as any, {} as any)).toBeTrue();
    });

    it('should allow if there are no query params', () => {
      expect(guard.canActivate({} as any, {} as any)).toBeTrue();
    });
  });

});
