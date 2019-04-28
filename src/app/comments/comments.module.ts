import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { CommentUrlPipe } from './comment-url.pipe';
import { CommentEmojiPipe } from './comment-emoji.pipe';
import { FormsModule } from '@angular/forms';
import { CommentService } from './comment.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [CommentComponent, CommentUrlPipe, CommentEmojiPipe],
    exports: [CommentComponent, CommentEmojiPipe, CommentUrlPipe],
    providers: [CommentService]
})
export class CommentsModule { }
