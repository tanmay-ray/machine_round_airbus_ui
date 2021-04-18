import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Data, Params } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { UserService } from '../user.service';

import { UserComponent } from './user.component';

const mockUser: User = Object.freeze({
  name: 'John Doe',
  dob: new Date(),
  age: 20,
  email: 'john.doe@gmail.com',
  gender: 'Male',
  phone: 7788665544
});

class MockUserService {
  getUser(email: string) { return of(mockUser); }
}

class MockActivatedRoute implements Partial<ActivatedRoute> {
  private _data: Data;
  private _queryParams: Params;

  get snapshot(): ActivatedRouteSnapshot {
    const snapshot: Partial<ActivatedRouteSnapshot> = {
      data: this._data,
      queryParams: this._queryParams
    };

    return snapshot as ActivatedRouteSnapshot;
  }

  setData(data: Data) {
    this._data = data;
  }

  setQueryParams(queryParams: Params) {
    this._queryParams = queryParams;
  }
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userSpy: jasmine.Spy;
  let mockRoute: MockActivatedRoute;

  beforeEach(async(() => {
    mockRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    userSpy = spyOn(TestBed.inject(UserService), 'getUser').and.callThrough();
    mockRoute.setData({ loggedInUser: { email: 'john.doe@gmail.com', isAdmin: false } });

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should read email from router data and load user details', () => {
    expect(userSpy).toHaveBeenCalledWith('john.doe@gmail.com');
    expect(component.user).toEqual(mockUser);
  });

  it('should diplay error page on api failure', () => {
    userSpy.and.returnValue(throwError('error'));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.loadingError).toBeTrue();
  });

  it('should not enable button to go back to users page', () => {
    expect(fixture.debugElement.query(By.css('#admin-only-go-back'))).toBeFalsy();
  });

  describe('Admin user', () => {

    beforeEach(() => {
      mockRoute.setData({ loggedInUser: { email: 'john.doe@gmail.com', isAdmin: true } });
      mockRoute.setQueryParams({ user: 'someone_else@gmail.com' });
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should read data from query params instead of data', () => {
      expect(userSpy).toHaveBeenCalledWith('someone_else@gmail.com');
    });

    it('should enable button to go back to users page', () => {
      expect(fixture.debugElement.query(By.css('#admin-only-go-back'))).toBeTruthy();
    });

  });
});
