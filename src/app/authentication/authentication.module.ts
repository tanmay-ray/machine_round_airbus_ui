import { NgModule } from '@angular/core';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [SharedModule, AuthenticationRoutingModule]
})
export class AuthenticationModule { }
