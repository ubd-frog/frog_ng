import { Routes, RouterModule } from '@angular/router';

import { ViewerComponent } from './viewer.component';
import { LoggedInGuard } from '../user/loggedin.guard';

export const viewerRoutes: Routes = [
    { path: 'v/:guid', component: ViewerComponent, canActivate: [LoggedInGuard] },
    { path: 'v/:guid/slideshow', component: ViewerComponent, canActivate: [LoggedInGuard], data: {"slideshow": true} },
    { path: 'v/:guid/:selection', component: ViewerComponent, canActivate: [LoggedInGuard] },
    { path: 'v/:guid/:selection/slideshow', component: ViewerComponent, canActivate: [LoggedInGuard], data: {"slideshow": true} },
    { path: 'v/:guid/:selection/:gallery', component: ViewerComponent, canActivate: [LoggedInGuard] },
];

export const viewerRoutingProviders: any[] = [];
export const viewerRouting = RouterModule.forChild(viewerRoutes);
