import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { WorksDetailComponent } from './works-detail/works-detail.component';
import { TagArtistFilterPipe } from './tag-artist-filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AutocompleteComponent, RemoveDialogComponent, WorksDetailComponent, TagArtistFilterPipe]
})
export class SharedModule { }
