import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { CommentUrlPipe } from './comment-url.pipe';
import { CommentEmojiPipe } from './comment-emoji.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CommentComponent, CommentUrlPipe, CommentEmojiPipe]
})
export class CommentsModule { }
