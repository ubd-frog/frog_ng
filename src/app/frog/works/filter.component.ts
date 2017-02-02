import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { GalleryService } from './gallery.service';
import { NavigationComponent } from './navigation.component';
import { Tag, Gallery, User } from '../shared/models';
import { TagComponent } from '../tags/tag.component';
import { TagsService } from '../tags/tags.service';
import { AutocompleteComponent } from '../shared/autocomplete.component';
import { UploaderService } from '../uploader/uploader.service';
import { PreferencesService } from '../user/preferences.service';
import { UserService } from '../user/user.service';
import { TagsListComponent } from '../tags/tags-list.component';


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
                    <li *ngIf="user?.isManager" class="right">
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
                    <li id='filtered_results' *ngFor="let bucket of service.terms">
                        <tag *ngFor="let item of bucket" [item]="item" (onClose)="removeTag($event)"></tag>
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
            // -- Set the favicon
            document.getElementById('favicon').setAttribute('href', data.favicon);
        });
        this.userservice.user.subscribe(user => this.user = user);
        this.sub = this.route.params.subscribe(params => {
            this.galleryid = +params['id'];
            this.service.reset();
            if (params['bucket1']) {
                params['bucket1'].split('+').forEach(element => {
                    this.service.addTerm(element, 0, true);
                });
            }

            if (params['bucket2']) {
                params['bucket2'].split('+').forEach(element => {
                    this.service.addTerm(element, 1, true);
                });
            }

            this.service.get(this.galleryid);
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    addTag(event: any) {
        let name = event.tag.id.toString();
        if (name === '0') {
            name = event.tag.name;
        }
        this.tagservice.resolve(name).subscribe(tag => {
            let tagid = (tag == null) ? name : tag.id;
            if (event.shiftKey) {
                this.addTagString(tagid, 1);
            }
            else {
                this.addTagString(tagid);
            }
        });
    }
    addTagString(name: string, bucket: number=0) {
        if (bucket == 0 || this.service.terms[0].length == 0) {
            this.router.navigate(['w/' + this.galleryid + '/' + name]);
        }
        else {
            this.router.navigate(['w/' + this.galleryid + '/' + this.service.terms[0].join('+') + '/' + name]);
        }
    }
    removeTag(tag:Tag) {
        this.router.navigate(['w/' + this.galleryid]);
    }
    addFiles(event: Event) {
        let element = <HTMLInputElement>event.target;
        this.uploadservice.addFiles(element.files);
    }
    gallerySelectHandler(gallery: Gallery) {
        this.router.navigate(['w/' + gallery.id]);
    }
}
