import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from './error.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [ErrorService]
})
export class ErrorhandlingModule { }
