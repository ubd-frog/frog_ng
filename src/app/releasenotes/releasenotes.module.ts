import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseNotesComponent } from './release-notes/release-notes.component';
import { ReleaseNotesService } from './release-notes.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ReleaseNotesComponent],
    exports: [ReleaseNotesComponent],
    providers: [ReleaseNotesService]
})
export class ReleasenotesModule { }
