import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from 'src/app/model/user.model';
import { UserService } from '../user.service';

import { UserListComponent } from './user-list.component';

const mockUsers: User[] = [
  Object.freeze({
    name: 'John Doe',
    dob: new Date(),
    age: 20,
    email: 'john.doe@gmail.com',
    gender: 'Male',
    phone: 7788665544
  }),
  Object.freeze({
    name: 'Jane Doe',
    dob: new Date(),
    age: 20,
    email: 'jane.doe@gmail.com',
    gender: 'Female',
    phone: 7788665544
  })
];
class MockUserService {
  getUserList() { return of(mockUsers).pipe(delay(0)); }
}

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UserListComponent],
      providers: [{ provide: UserService, useClass: MockUserService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter data', () => {
    const event = { target: { value: 'jane' } as any };
    component.applyFilter(event as Event);
    expect(component.dataSource.filteredData.length).toBe(1);
  });

  it('should be able to open individual user page', () => {
    const spy = spyOn(TestBed.inject(Router), 'navigate');
    component.openUserDetails({ email: 'someone@gmail.com' } as User);
    expect(spy).toHaveBeenCalledWith(['user'], { queryParams: { user: 'someone@gmail.com' } });
  });
});
