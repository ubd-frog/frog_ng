import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from '../user/loggedin.guard';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
    { path: 'v/:guid', component: ViewerComponent, canActivate: [LoggedInGuard] },
    { path: 'v/:guid/slideshow', component: ViewerComponent, canActivate: [LoggedInGuard], data: { "slideshow": true } },
    { path: 'v/:guid/:selection', component: ViewerComponent, canActivate: [LoggedInGuard] },
    { path: 'v/:guid/:selection/slideshow', component: ViewerComponent, canActivate: [LoggedInGuard], data: { "slideshow": true } },
    { path: 'v/:guid/:selection/:gallery', component: ViewerComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewerRoutingModule { }
