import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from "rxjs/Subscription";

import { VideoViewerComponent } from '../../viewer/video-viewer/video-viewer.component';
import { ImageViewerComponent } from '../../viewer/image-viewer/image-viewer.component';
import { CGroup, CItem, Preferences } from "../../shared/models";
import { WorksService } from "../../works/works.service";
import { SelectionService } from "../../shared/selection.service";
import { PreferencesService } from "../../user/preferences.service";


@Component({
    selector: 'group-viewer',
    templateUrl: './group-viewer.component.html',
    styleUrls: ['./group-viewer.component.css']
})

export class GroupViewerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(ImageViewerComponent) image: ImageViewerComponent;
    @ViewChild(VideoViewerComponent) video: VideoViewerComponent;

    private index: number = 0;
    private subs: Subscription[] = [];
    public objects: CItem[] = [];
    public object: CGroup;
    public itemtype: string;
    public prefs: Preferences;

    constructor(
        private service: WorksService,
        private selectionservice: SelectionService,
        private prefservice: PreferencesService
    ) {
        let sub = this.prefservice.preferences.subscribe(prefs => this.prefs = prefs);
        this.subs.push(sub);
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    ngAfterViewInit() {
        let sub = this.selectionservice.detail.distinctUntilChanged().subscribe(data => {
            if (data.item && data.item.guid.charAt(0) === '4') {
                setTimeout(() => this.setImage(data.item), 0);
            }
        });
        this.subs.push(sub);
    }

    setImage(group: CItem) {
        this.object = <CGroup>group;
        this.objects = this.object.children;
        this.setIndex(0);
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        let triggered = false;
        if (event.key === 'q') {
            triggered = true;
            this.previous();
        }
        if (event.key === 'e') {
            triggered = true;
            this.next();
        }

        if (triggered) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    next() {
        let index: number = this.index + 1;
        index = (index > this.objects.length - 1) ? 0 : index;
        this.setIndex(index);
    }
    previous() {
        let index = this.index - 1;
        index = (index < 0) ? this.objects.length - 1 : index;
        this.setIndex(index);
    }
    original() {
        if (this.image) {
            this.image.original();
        }
        if (this.video) {
            this.video.original();
        }
    }
    fitToWindow() {
        if (this.image) {
            this.image.fitToWindow();
        }
        if (this.video) {
            this.video.fitToWindow();
        }
    }

    setFocus() {
        this.selectionservice.setDetailItem(this.objects[this.index]);
    }

    setIndex(index: number) {
        this.index = index;
        if (this.objects.length) {
            switch (this.objects[index].guid.charAt(0)) {
                case '1':
                    this.itemtype = 'image';
                    this.image.setImage(this.objects[this.index]);
                    break;
                case '2':
                    this.itemtype = 'video';
                    this.video.setImage(this.objects[this.index]);
                    break;
            }
        }
    }
}
