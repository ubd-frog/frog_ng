import { Component, HostListener } from '@angular/core';
import { SelectionService } from '../../shared/selection.service';
import { StorageService } from '../../shared/storage.service';
import { WorksService } from '../works.service';




@Component({
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.css']
})
export class WorksComponent {
    private guids: string[];

    constructor(
        private service: SelectionService,
        private storage: StorageService,
        private workservice: WorksService,
        // private notify: NotificationService
    ) {
        this.service.selection.subscribe(items => {
            this.guids = items.map(item => item.guid);
        });
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'd' || event.key == 'Esc' || event.key == 'Escape') {
            event.preventDefault();
            this.service.clear();
        }
        if (event.ctrlKey && event.key === 'a') {
            event.preventDefault();
            this.service.selectAll();
        }
        if (event.ctrlKey && event.key === 'c' && this.guids.length > 0) {
            event.preventDefault();
            this.storage.set('clipboard', { 'guids': this.guids, 'id': null });
            this.service.clear();
            // this.notify.add(new Notification('Copy', 'content_copy'));
        }
        if (event.ctrlKey && event.key === 'x' && this.guids.length > 0) {
            event.preventDefault();
            this.storage.set('clipboard', { 'guids': this.guids, 'id': this.workservice.id });
            this.service.clear();
            // this.notify.add(new Notification('Cut', 'content_cut'));
        }
        if (event.ctrlKey && event.key === 'v') {
            if (document.activeElement.tagName === 'BODY') {
                let item = this.storage.pop('clipboard');
                if (item != null) {
                    event.preventDefault();
                    this.workservice.copyItems(item.guids, item.id);
                }
            }
        }
    }
}
