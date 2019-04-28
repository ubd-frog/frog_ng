import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { TagArtistFilterPipe } from './tag-artist-filter.pipe';
import { UserModule } from '../user/user.module';
import { CommentsModule } from '../comments/comments.module';
import { FormsModule } from '@angular/forms';
import { SelectionService } from './selection.service';
import { SiteConfigService } from './siteconfig.service';
import { SlideshowService } from './slideshow.service';
import { StorageService } from './storage.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        UserModule,
        CommentsModule,
    ],
    providers: [SelectionService, SiteConfigService, SlideshowService, StorageService],
    declarations: [AutocompleteComponent, RemoveDialogComponent, TagArtistFilterPipe],
    exports: [AutocompleteComponent, RemoveDialogComponent, TagArtistFilterPipe]
})
export class SharedModule { }
