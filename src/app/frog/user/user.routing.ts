import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';

export const userRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent }
];

export const userRoutingProviders: any[] = [];
export const userRouting = RouterModule.forChild(userRoutes);
