import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { GalleryService } from './gallery.service';
import { NavigationComponent } from './navigation.component';
import {Tag, Gallery, User, Branding} from '../shared/models';
import { TagsService } from '../tags/tags.service';
import { UploaderService } from '../uploader/uploader.service';
import { PreferencesService } from '../user/preferences.service';
import { UserService } from '../user/user.service';
import { TagsListComponent } from '../tags/tags-list.component';

import {Observable} from "rxjs";
import "rxjs/add/operator/mergeMap";


@Component({
    selector: 'works-filter',
    templateUrl: './html/filter.html',
    styles: [
        '#filtered_results { position: relative; display: inline-flex; height: 100%; margin: 0 10px; }',
        '.file-field { height: 64px; padding: 0 15px; }',
        '.file-field i { margin: 0; }',
        '.file-field:hover { background-color: rgba(0,0,0,0.1); }'
    ]
})
export class FilterComponent implements OnInit, OnDestroy {
    @ViewChild(NavigationComponent) nav: NavigationComponent;
    @ViewChild(TagsListComponent) tagslist: TagsListComponent;
    private tags: string[];
    private galleryid: number;
    private query: string;
    public branding: Branding;
    public user: User;
    private sub;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public service: WorksService,
        private uploadservice: UploaderService,
        public preferencesService: PreferencesService,
        private galleryservice: GalleryService,
        private userservice: UserService,
        private tagservice: TagsService
    ) {
        this.tags = [];
    }
    ngOnInit() {
        this.galleryservice.branding().subscribe(data => {
            this.branding = data;
            // -- Set the favicon
            document.getElementById('favicon').setAttribute('href', data.favicon);
        });
        this.userservice.user.subscribe(user => this.user = user);
        this.sub = this.route.params.subscribe(params => {
            this.galleryid = +params['id'];
            this.galleryservice.setGalleryId(this.galleryid);
            this.service.reset();
            if (params['terms']) {
                let terms = this.dumps(params['terms']);
                this.service.setTerms(terms);
            }
            this.service.get(this.galleryid);
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    addTag(event: any) {
        if (event.tag.id == 0) {
            let query = this.parseUserInput(event.tag.name);
            this.addTagString(query);
        }
        else {
            this.tagservice.resolve(event.tag.id).subscribe(tag => {
                let tagid = (tag == null) ? name : tag.id;
                this.addTagString(tagid);
            });
        }
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
