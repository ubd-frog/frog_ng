import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorksService } from './works.service';
import { NavigationComponent } from './navigation.component';
import { Tag, Gallery } from '../shared/models';
import { TagsComponent } from '../shared/tags.component';
import { AutocompleteComponent } from '../shared/autocomplete.component';
import { UploaderService } from '../uploader/uploader.service';
import { PreferencesService } from '../user/preferences.service';


@Component({
    selector: 'works-filter',
    template: `
    <div class="navbar-fixed">
        <nav class="light-green darken-2">
            <div class="nav-wrapper">
                <!--<a href="#" class="brand-logo right"><i class="material-icons">collections</i></a>-->
                <ul>
                    <li>
                        <a (click)="nav.toggle()" class="dropdown-button">
                            <i class="small material-icons left">collections</i>Galleries
                        </a>
                    </li>
                    <li class="right">
                        <a (click)="preferencesService.show()" class="dropdown-button">
                            <i class="small material-icons">settings</i>
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
    `,
    styles: [
        '#filtered_results { position: relative; display: inline-flex; height: 100%; margin: 0 10px; }',
        '.file-field { height: 64px; padding: 0 15px; }',
        '.file-field i { margin: 0; }'
    ]
})
export class FilterComponent implements OnInit, OnDestroy {
    @ViewChild(NavigationComponent) nav: NavigationComponent;
    private tags: string[];
    private galleryid: number;
    private query: string;
    private sub;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: WorksService,
        private uploadservice: UploaderService,
        private preferencesService: PreferencesService
    ) {
        this.tags = [];
    }
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.galleryid = +params['id'];
            this.service.reset();
            if (params['bucket1']) {
                params['bucket1'].split('+').forEach(element => {
                    this.service.addTerm(parseInt(element) || element, 0, true);
                });
            }
            
            if (params['bucket2']) {
                params['bucket2'].split('+').forEach(element => {
                    this.service.addTerm(parseInt(element) || element, 1, true);
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
        if (event.shiftKey) {
            this.addTagString(name, 1);
        }
        else {
            this.addTagString(name);
        }
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