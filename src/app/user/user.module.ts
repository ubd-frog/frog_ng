import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { GallerySubscriptionComponent } from './gallery-subscription/gallery-subscription.component';
import { UserInputComponent } from './userinput/userinput.component';
import { LoggedInGuard } from './loggedin.guard';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { ErrorhandlingModule } from '../errorhandling/errorhandling.module';
import { PreferencesService } from './preferences.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        UserRoutingModule,
        ErrorhandlingModule
    ],
    declarations: [LoginComponent, LogoutComponent, PreferencesComponent, UserInputComponent, GallerySubscriptionComponent],
    exports: [UserInputComponent, PreferencesComponent],
    providers: [UserService, PreferencesService, LoggedInGuard]
})
export class UserModule { }
