import { Routes, RouterModule } from '@angular/router';

import { GroupEditorComponent } from './group-editor/group-editor.component';
import { LoggedInGuard } from '../user/loggedin.guard';
import { NgModule } from '@angular/core';


const routes: Routes = [
    { path: 'g/:id', component: GroupEditorComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class GroupsRoutingModule { }
