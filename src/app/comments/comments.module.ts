import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CommentService } from './comment.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        SharedModule
    ],
    declarations: [CommentComponent],
    exports: [CommentComponent],
    providers: [CommentService]
})
export class CommentsModule { }
