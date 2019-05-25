import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GallerySubscriptionComponent } from './gallery-subscription/gallery-subscription.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserInputComponent } from './user-input/user-input.component';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { PreferencesService } from './preferences.service';
import { LoggedInGuard } from './loggedin.guard';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [GallerySubscriptionComponent, LoginComponent, LogoutComponent, PreferencesComponent, UserInputComponent],
    exports: [GallerySubscriptionComponent, LoginComponent, LogoutComponent, PreferencesComponent, UserInputComponent],
    providers: [UserService, PreferencesService, LoggedInGuard]
})
export class UserModule { }
