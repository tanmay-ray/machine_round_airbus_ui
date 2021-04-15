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
  userId: number;
  loading: boolean;

  constructor(private userService: UserService, router: Router) {
    this.userId = router.getCurrentNavigation()?.extras?.state?.userId;
    this.loading = !!this.userId;
  }

  ngOnInit(): void {
    if (this.loading) {
      this.userService.getUser(this.userId)
        .pipe(finalize(() => this.loading = false))
        .subscribe(user => this.user = user);
    }
  }

}
