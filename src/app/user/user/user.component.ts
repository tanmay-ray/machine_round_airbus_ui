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
  email: string;
  isAdmin: boolean;
  loading: boolean;
  loadingError: boolean;

  constructor(private userService: UserService, route: ActivatedRoute) {
    this.isAdmin = route.snapshot.data.loggedInUser.isAdmin;
    this.email = route.snapshot.queryParams?.user || route.snapshot.data.loggedInUser.email;
    this.loading = !!this.email;
    this.loadingError = !this.loading;
  }

  ngOnInit(): void {
    if (this.loading) {
      this.userService.getUser(this.email)
        .pipe(finalize(() => this.loading = false))
        .subscribe(user => this.user = user, err => {
          console.error(err);
          this.loadingError = true;
        });
    }
  }

}
