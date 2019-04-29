import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { ImageComponent } from '../../image-viewer/image/image.component';
import { VideoComponent } from '../../video-viewer/video/video.component';
import { CItem, Preferences } from '../../shared/models';
import { WorksService } from '../../works/works.service';
import { SelectionService } from '../../shared/selection.service';
import { StorageService } from '../../shared/storage.service';
import { SlideshowService } from '../../shared/slideshow.service';
import { PreferencesService } from '../../user/preferences.service';
import { randomInt } from '../../shared/common';


declare var $: any;


@Component({
    selector: 'viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit, OnDestroy {
    @ViewChild(ImageComponent) image: ImageComponent;
    @ViewChild(VideoComponent) video: VideoComponent;

    private allitems: CItem[];
    private viewall: boolean = false;
    private index: number = -1;
    private subs: Subscription[] = [];
    private closeroute: string;
    private timer;
    public objects: CItem[] = [];
    public itemtype: string;
    public prefs: Preferences;
    public width: number = 0;
    public height: number = 0;
    public slideshow: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService,
        private selectionservice: SelectionService,
        private storageservice: StorageService,
        private slideshowservice: SlideshowService,
        private location: Location,
        private prefservice: PreferencesService
    ) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        let sub = this.prefservice.preferences.subscribe(prefs => this.prefs = prefs);
        this.subs.push(sub);
        this.timer = null;
    }
    ngOnInit() {
        let sub = this.route.params.subscribe(params => {
            this.slideshow = Boolean(this.route.snapshot.data['slideshow']);

            let guid = params['guid'];
            let guids = (params['selection'] || '').split(',');
            if (guids[0].length !== 16) {
                // Gallery id, not selection
                // this.closeroute = '/w/' + guids[0];
                guids = [''];
            }

            if (params['gallery']) {
                this.closeroute = '/w/' + params['gallery'];
            }

            if (guids.length === 1 && guids[0] === '') {
                this.viewall = true;
                guids = [guid];
            }

            let obsall = this.service.results.take(1);
            let obsresolve = this.service.resolveGuids(guids);

            sub = Observable.forkJoin([obsall, obsresolve]).subscribe(results => {
                if (this.viewall && results[0][0].length > 0) {
                    this.allitems = results[0][0];
                    this.objects = this.allitems;
                }
                else {
                    this.objects = results[1] as any;
                    let data = {
                        'closeroute': this.closeroute,
                        'assets': this.objects
                    };
                    this.storageservice.set('viewer', JSON.stringify(data));
                }

                this.index = Math.max(0, this.objects.map(o => o.guid).indexOf(guid));
                this.setIndex(this.index);
                if (this.slideshow) {
                    let timeout = this.prefs.slideshowDuration;
                    if (this.objects[this.index].guid.charAt(0) == '2') {
                        // Check where to play videos or not
                        if (this.prefs.slideshowPlayVideo) {
                            timeout = this.video.object.duration;
                        }
                    }

                    this.slideshowservice.start(this.next.bind(this), timeout);
                }
            });
            this.subs.push(sub);
        });
        this.subs.push(sub);
    }
    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }
    @HostListener('window:stateChange', ['$event'])
    stateChange() {
        this.stopSlideShow();
    }
    @HostListener('window:resize')
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        let triggered = false;
        if (event.key === 'Tab' || event.keyCode === 0 || event.keyCode === 9) {
            triggered = true;
            this.setFocus();
        }
        if (event.key === 'ArrowLeft' || event.key === 'Left' || event.key === 'a') {
            triggered = true;
            this.previous();
        }
        if (event.key === 'ArrowRight' || event.key === 'Right' || event.key === 'd') {
            triggered = true;
            this.next();
        }
        if (event.key === '2' || event.key === 'ArrowDown' || event.key === 's') {
            triggered = true;
            this.fitToWindow();
        }
        if (event.key === '1' || event.key === 'ArrowUp' || event.key === 'w') {
            triggered = true;
            this.original();
        }
        if (event.key === 'Escape' || event.key === 'Esc') {
            triggered = true;
            this.close(event);
        }

        if (triggered) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    next() {
        let index: number;
        if (this.slideshow && this.prefs.slideshowRandomize) {
            index = randomInt(0, this.objects.length);
            while (index === this.index) {
                index = randomInt(0, this.objects.length);
            }
        }
        else {
            index = this.index + 1;
            index = (index > this.objects.length - 1) ? 0 : index;
        }

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
    close(event: Event) {
        if (event !== null) {
            event.preventDefault();
        }

        this.selectionservice.clearDetailItem();
        this.stopSlideShow();

        // Use closeroute
        this.router.navigate([this.closeroute || this.service.routecache || '/w/1']);
    }
    setIndex(index: number) {
        if (this.objects[index].guid.charAt(0) === this.objects[this.index].guid.charAt(0)) {
            this.selectionservice.clearDetailItem();
        }
        this.index = index;
        if (this.objects.length) {
            switch (this.objects[index].guid.charAt(0)) {
                case '1':
                    this.itemtype = 'image';
                    break;
                case '2':
                    this.itemtype = 'video';
                    break;
            }

            this.selectionservice.setDetailItem(this.objects[index], false);
            let url = ['/v', this.objects[this.index].guid];
            if (this.objects.length > 1 && !this.viewall) {
                url.push(this.objects.map(o => o.guid).join(','));
            }
            if (this.slideshow) {
                url.push('slideshow');
            }
            this.router.navigate(url, { replaceUrl: true });
        }
    }
    playSlideShow() {
        let url = this.route.snapshot.url.map(u => u.toString());
        url.push('slideshow');
        this.router.navigate(url);
    }
    stopSlideShow() {
        this.slideshowservice.stop();
        let url = this.route.snapshot.url.map(u => u.toString());
        url.pop();
        this.router.navigate(url);
    }
}
