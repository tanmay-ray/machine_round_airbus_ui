import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList$: Observable<User>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // this.userList$ = this.userService.getUserList();
  }

}
