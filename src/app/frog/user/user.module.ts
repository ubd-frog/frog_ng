import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { UserService } from './user.service';
import { userRouting } from './user.routing';

@NgModule({
    imports: [
        CommonModule,
        userRouting
    ],
    exports: [],
    declarations: [
        LoginComponent,
        LogoutComponent
    ],
    providers: [
        UserService
    ],
})
export class UserModule { }
