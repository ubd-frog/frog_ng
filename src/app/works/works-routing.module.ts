import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorksComponent } from './works/works.component';
import { LoggedInGuard } from '../user/loggedin.guard';

const routes: Routes = [
    { path: '', component: WorksComponent, canActivate: [LoggedInGuard] },
    { path: 'w/:id', component: WorksComponent, canActivate: [LoggedInGuard] },
    { path: 'w/:id/:terms', component: WorksComponent, canActivate: [LoggedInGuard] },
    { path: 'p', component: WorksComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class WorksRoutingModule { }