import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserinputComponent } from './userinput/userinput.component';
import { GallerySubscriptionComponent } from './gallery-subscription/gallery-subscription.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [LoginComponent, LogoutComponent, PreferencesComponent, UserinputComponent, GallerySubscriptionComponent]
})
export class UserModule { }
