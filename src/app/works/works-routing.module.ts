import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorksComponent } from './works/works.component';
import { LoggedInGuard } from '../user/loggedin.guard';

const routes: Routes = [
    { path: '', redirectTo: '/w/1', pathMatch: 'full' },
    { path: 'w/:id', component: WorksComponent, canActivate: [LoggedInGuard] },
    { path: 'w/:id/:terms', component: WorksComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorksRoutingModule { }
