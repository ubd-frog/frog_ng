import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { WorksService } from '../works.service';
import { GalleryService } from '../gallery.service';
import { NavigationComponent } from '../../shared/navigation/navigation.component';
import { Tag, Gallery, User, SiteConfig, ReleaseNote } from '../../shared/models';
import { TagsService } from '../../tags/tags.service';
import { UploaderService } from '../../uploader/uploader.service';
import { PreferencesService } from '../../user/preferences.service';
import { UserService } from '../../user/user.service';
import { SiteMenuComponent } from '../sitemenu/sitemenu.component';
import { ReleaseNotesService } from '../../releasenotes/releasenotes.service';
import { SiteConfigService } from '../../siteconfig';
import { Observable } from 'rxjs/Observable';


@Component({
    selector: 'works-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {
    @ViewChild(NavigationComponent) nav: NavigationComponent;
    @ViewChild(SiteMenuComponent) sitemenu: SiteMenuComponent;

    public siteconfig: SiteConfig;
    public user: User;
    public notes: ReleaseNote[];
    public gallery: Gallery;
    private galleryid: number;
    private query: string;
    private subs: Subscription[];
    private blank: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public service: WorksService,
        private uploadservice: UploaderService,
        public preferencesService: PreferencesService,
        private galleryservice: GalleryService,
        private userservice: UserService,
        private tagservice: TagsService,
        private releasenotesservice: ReleaseNotesService,
        private siteconfigservice: SiteConfigService
    ) {
        this.subs = [];
        this.notes = [];
        this.blank = false;
        this.gallery = new Gallery();
    }
    ngOnInit() {
        let sub;

        sub = this.galleryservice.gallery.subscribe(gallery => this.gallery = gallery);
        this.subs.push(sub);

        sub = this.userservice.user.subscribe(user => this.user = user);
        this.subs.push(sub);

        sub = this.releasenotesservice.notes.subscribe(notes => this.notes = notes);
        this.subs.push(sub);

        // These two depend on each other
        let obssiteconfig = this.siteconfigservice.siteconfig;
        let obsroute = this.route.params;

        sub = Observable.combineLatest([obssiteconfig, obsroute]).subscribe(results => {
            let data = results[0] as any;
            let params = results[1];

            // Route
            let terms = null;
            this.galleryid = +params['id'];
            this.galleryservice.setGalleryId(this.galleryid);
            this.service.reset();
            if (params['terms']) {
                terms = this.dumps(params['terms']);
                this.service.setTerms(terms);
            }

            if (isNaN(this.galleryid)) {
                this.blank = true;
            }
            else {
                let force = this.galleryid === 0;
                this.service.get(this.galleryid, false, force);
            }

            // SiteConfig
            this.siteconfig = data;

            // -- Set the favicon
            document.getElementById('favicon').setAttribute('href', data.favicon);

            if (this.blank) {
                let itemsub = this.galleryservice.items.subscribe(items => {
                    let ids = items.map(item => item.id);
                    if (ids.length > 0) {
                        this.router.navigate([`w/${ids[0]}`]);
                    }
                });
            }
        });
        this.subs.push(sub);
    }
    ngOnDestroy() {
        this.subs.map(sub => sub.unsubscribe());
    }
    addTag(event: any) {
        this.tagservice.resolve(event.value).subscribe(tag => {
            if (tag) {
                this.addTagString(tag.id);
            }
            else {
                this.addTagString(event.value);
            }
        });
    }
    addTagString(name: string) {
        this.router.navigate(['w/' + this.galleryid + '/' + name]);
    }
    removeTag(tag: Tag, row: number, col: number) {
        let terms = this.service.terms.splice(0);
        terms[row].splice(col, 1);
        terms = terms.filter(row => row.length > 0);
        if (terms.length < 2) {
            terms.push([]);
        }
        let query = [];
        for (let bucket of terms) {
            if (bucket.length) {
                query.push(bucket.join('|'));
            }
        }
        if (query.length && query[0].length > 0) {
            this.router.navigate([`w/${this.galleryid}/${query.join('+')}`]);
        }
        else {
            this.router.navigate([`w/${this.galleryid}`]);
        }
    }
    addFiles(event: Event) {
        let element = <HTMLInputElement>event.target;
        this.uploadservice.addFiles(element.files);
        element.value = null;
    }
    gallerySelectHandler(gallery: Gallery) {
        this.router.navigate(['w/' + gallery.id]);
    }
    private parseUserInput(input: string) {
        input = input.toLocaleLowerCase();
        let buckets = input.split(' and ');
        let ors = [];
        for (let bucket of buckets) {
            let b = [];
            for (let value of bucket.split(' or ')) {
                let tag = this.tagservice.getTagByName(value.trim());
                if (tag == null) {
                    b.push(value);
                }
                else {
                    b.push(tag.id);
                }
            }

            ors.push(b.join('|'));
        }

        return ors.join('+');
    }
    private dumps(url: string) {
        let query = [];
        let buckets = url.split('+');
        for (let bucket of buckets) {
            let b = [];
            for (let value of bucket.split('|')) {
                if (isNaN(Number(value))) {
                    b.push(value);
                }
                else {
                    b.push(Number(value));
                }
            }
            query.push(b);
        }

        return query;
    }
}
