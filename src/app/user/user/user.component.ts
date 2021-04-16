import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  loading: boolean;

  constructor(private userService: UserService, router: Router) {
    this.email = router.getCurrentNavigation()?.extras?.state?.email;
    this.loading = !!this.email;
  }

  ngOnInit(): void {
    if (this.loading) {
      this.userService.getUser(this.email)
        .pipe(finalize(() => this.loading = false))
        .subscribe(user => this.user = user);
    }
  }

}
