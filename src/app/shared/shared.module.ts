import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { CapitalizePipe } from './capitalize.pipe';
import { CommentEmojiPipe } from './comment-emoji.pipe';
import { CommentUrlPipe } from './comment-url.pipe';
import { NavigationComponent } from './navigation/navigation.component';
import { SlideshowService } from './slideshow.service';
import { SelectionService } from './selection.service';
import { SiteConfigService } from './siteconfig.service';
import { StorageService } from './storage.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
    ],
    declarations: [AutocompleteComponent, RemoveDialogComponent, CapitalizePipe, NavigationComponent, CommentEmojiPipe, CommentUrlPipe],
    exports: [CapitalizePipe, CommentEmojiPipe, CommentUrlPipe, AutocompleteComponent, NavigationComponent, RemoveDialogComponent],
    providers: [SlideshowService, SelectionService, SiteConfigService, StorageService]
})
export class SharedModule { }
