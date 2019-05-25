import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationService } from './notification.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [NotificationComponent, NotificationListComponent],
    exports: [NotificationListComponent],
    providers: [NotificationService]
})
export class NotificationsModule { }
