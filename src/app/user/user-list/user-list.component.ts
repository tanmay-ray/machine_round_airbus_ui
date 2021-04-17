import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/model/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<User>;
  loading = true;
  loadingError = false;
  displayedColumns = ["name", "dob", "gender", "age", "email", "phone"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.userService.getUserList()
      .pipe(finalize(() => this.loading = false))
      .subscribe(users => {
        this.dataSource = new MatTableDataSource(users)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (user, email) => user.email.includes(email);
      }, err => {
        console.error(err);
        this.loadingError = true;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserDetails({ email }: User) {
    this.router.navigate(['user'], { queryParams: { user: email } });
  }

}
