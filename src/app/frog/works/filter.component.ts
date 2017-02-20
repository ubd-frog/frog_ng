import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { GalleryService } from './gallery.service';
import { NavigationComponent } from './navigation.component';
import { Tag, Gallery, User } from '../shared/models';
import { TagsService } from '../tags/tags.service';
import { UploaderService } from '../uploader/uploader.service';
import { PreferencesService } from '../user/preferences.service';
import { UserService } from '../user/user.service';
import { TagsListComponent } from '../tags/tags-list.component';

import {Observable} from "rxjs";
import "rxjs/add/operator/mergeMap";


@Component({
    selector: 'works-filter',
    template: `
    <div class="navbar-fixed">
        <nav class="light-green darken-2">
            <div class="nav-wrapper">
                <!--<a href="#" class="brand-logo left"><img src="{{branding?.icon}}" /></a>-->
                <ul>
                    <li>
                        <a (click)="nav.toggle()" class="dropdown-button">
                            <i class="material-icons left">collections</i>Galleries
                        </a>
                    </li>
                    <li class="right">
                        <a href="{{branding?.link}}" target="_blank" rel="noopener noreferrer">
                            <i class="material-icons">help_outline</i>
                        </a>
                    </li>
                    <li class="right">
                        <a (click)="tagslist.show()">
                            <i class="material-icons">loyalty</i>
                        </a>
                    </li>
                    <li class="right">
                        <a (click)="preferencesService.show()">
                            <i class="material-icons right">settings</i> {{user?.name}}
                        </a>
                    </li>
                    <li>
                        <div class="file-field input-field">
                            <i class="material-icons">cloud_upload</i>
                            <input type="file" multiple (change)="addFiles($event)" title="Upload files">
                        </div>
                    </li>
                    <li>
                        <autocomplete (onSelect)="addTag($event)"></autocomplete>
                    </li>
                    <li id='filtered_results' *ngFor="let bucket of service.terms; let i = index;">
                        <tag *ngFor="let item of bucket; let j = index;" [item]="item" (onClose)="removeTag($event, i, j)"></tag><span *ngIf="service.terms.length > 1"> &amp; </span>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    <works-nav (onSelect)="gallerySelectHandler($event)"></works-nav>
    <tags-list #tagslist></tags-list>
    `,
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
    private branding: Object = {};
    private user: User;
    private sub;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService,
        private uploadservice: UploaderService,
        private preferencesService: PreferencesService,
        private galleryservice: GalleryService,
        private userservice: UserService,
        private tagservice: TagsService
    ) {
        this.tags = [];
    }
    ngOnInit() {
        this.galleryservice.branding().subscribe(data => {
            this.branding = data;
        });
        this.userservice.user.subscribe(user => this.user = user);
        this.sub = this.route.params.subscribe(params => {
            this.galleryid = +params['id'];
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
    removeTag(tag:Tag, row: number, col: number) {
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
        if (query[0].length > 0) {
            this.router.navigate([`w/${this.galleryid}/${query.join('+')}`]);
        }
        else {
            this.router.navigate([`w/${this.galleryid}`]);
        }
    }
    addFiles(event: Event) {
        let element = <HTMLInputElement>event.target;
        this.uploadservice.addFiles(element.files);
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
                let tag = this.tagservice.getTagByName(value);
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
