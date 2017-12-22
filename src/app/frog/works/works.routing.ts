import { Routes, RouterModule } from '@angular/router';

import { WorksComponent } from './works.component';
import { LoggedInGuard } from '../user/loggedin.guard';


export const worksRoutes: Routes = [
    { path: '', redirectTo: '/w/1', pathMatch: 'full' },
    { path: 'w/:id', component: WorksComponent, canActivate: [LoggedInGuard] },
    { path: 'w/:id/:terms', component: WorksComponent, canActivate: [LoggedInGuard] },
];

export const worksRoutingProviders: any[] = [];
export const worksRouting = RouterModule.forChild(worksRoutes);
