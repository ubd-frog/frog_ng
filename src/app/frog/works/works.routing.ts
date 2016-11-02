import { Routes, RouterModule } from '@angular/router';

import { WorksComponent } from './works.component';

export const worksRoutes: Routes = [
    { path: 'w/:id', component: WorksComponent },
    { path: 'w/:id/:bucket1', component: WorksComponent },
    { path: 'w/:id/:bucket1/:bucket2', component: WorksComponent }
];

export const worksRoutingProviders: any[] = [];
export const worksRouting = RouterModule.forChild(worksRoutes);
