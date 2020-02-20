import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule, MatInputModule, MatCheckboxModule} from '@angular/material';

import {BadgeComponent} from './badge/badge.component';
import {BadgeDialogComponent} from './badge-dialog/badge-dialog.component';
import {BadgeService} from "./badge.service";
import {SharedModule} from "../shared/shared.module";
import {TagsModule} from "../tags/tags.module";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,

        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatListModule,
        MatIconModule,

        SharedModule,
        TagsModule,
    ],
    declarations: [BadgeComponent, BadgeDialogComponent],
    exports: [BadgeDialogComponent, BadgeComponent],
    providers: [BadgeService]
})
export class BadgeModule {
}
