import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User } from '../../model/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  loggedUser: { email: string, isAdmin: boolean };
  loading: boolean;

  constructor(private userService: UserService, route: ActivatedRoute) {
    this.loggedUser = route.snapshot.data?.loggedInUser;
    this.loading = !!this.loggedUser;
  }

  ngOnInit(): void {
    if (this.loading) {
      this.userService.getUser(this.loggedUser.email)
        .pipe(finalize(() => this.loading = false))
        .subscribe(user => this.user = user);
    }
  }

}
