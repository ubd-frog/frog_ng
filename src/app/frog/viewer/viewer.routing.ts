import { Routes, RouterModule } from '@angular/router';

import { ViewerComponent } from './viewer.component';

export const viewerRoutes: Routes = [
    { path: 'v/:focus', component: ViewerComponent },
    { path: 'v/:focus/:guids', component: ViewerComponent },
    { path: 'v/:focus/:guids/+', component: ViewerComponent, data: {'all': true} }
];

export const viewerRoutingProviders: any[] = [];
export const viewerRouting = RouterModule.forChild(viewerRoutes);
