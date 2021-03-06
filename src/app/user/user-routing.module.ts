import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAuthGuard } from '../route-guard/admin-auth.guard';
import { UserAuthGuard } from '../route-guard/user-auth.guard';
import { UserListComponent } from './user-list/user-list.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [UserAuthGuard]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [UserAuthGuard, AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
