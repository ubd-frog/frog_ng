import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleasenotesDialogComponent } from './releasenotes-dialog/releasenotes-dialog.component';
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';
import { ReleaseNotesService } from './releasenotes.service';

@NgModule({
    imports: [
        CommonModule,
        MarkdownToHtmlModule
    ],
    declarations: [ReleasenotesDialogComponent],
    exports: [ReleasenotesDialogComponent],
    providers: [ReleaseNotesService]
})
export class ReleasenotesModule { }
