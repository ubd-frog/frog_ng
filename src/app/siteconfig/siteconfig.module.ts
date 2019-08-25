import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteconfigComponent } from './siteconfig/siteconfig.component';
// import { SiteconfigService } from './siteconfig.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatInputModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,

        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
    ],
    declarations: [SiteconfigComponent],
    exports: [SiteconfigComponent],
    // providers: [SiteconfigService]
})
export class SiteconfigModule { }
