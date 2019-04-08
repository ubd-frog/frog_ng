import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleasenotesComponent } from './releasenotes/releasenotes.component';
import { ReleaseNotesComponent } from './release-notes/release-notes.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ReleasenotesComponent, ReleaseNotesComponent]
})
export class ReleasenotesModule { }
