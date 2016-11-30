import { Routes, RouterModule } from '@angular/router';

import { ViewerComponent } from './viewer.component';
import { LoggedInGuard } from '../user/loggedin.guard';

export const viewerRoutes: Routes = [
    { path: 'v/:focus', component: ViewerComponent, canActivate: [LoggedInGuard] },
    { path: 'v/:focus/:guids', component: ViewerComponent, canActivate: [LoggedInGuard] },
    { path: 'v/:focus/:guids/+', component: ViewerComponent, data: {'all': true}, canActivate: [LoggedInGuard] }
];

export const viewerRoutingProviders: any[] = [];
export const viewerRouting = RouterModule.forChild(viewerRoutes);
