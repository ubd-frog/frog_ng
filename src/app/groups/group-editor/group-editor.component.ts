import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { CGroup, CItem, Tag, User } from "../../shared/models";
import { GroupService } from "../group.service";
import { ErrorService } from "../../errorhandling/error.service";
import { WorksService } from "../../works/works.service";
import { TagsService } from "../../tags/tags.service";
import { UserService } from "../../user/user.service";
import { CropperComponent } from '../../cropper/cropper/cropper.component';
import { UploaderService } from "../../uploader/uploader.service";
import { SiteMenuComponent } from '../../works/sitemenu/sitemenu.component';


@Component({
    selector: 'group-editor',
    templateUrl: './group-editor.component.html',
    styleUrls: ['./group-editor.component.css']
})

export class GroupEditorComponent implements AfterViewChecked, OnDestroy {
    @ViewChild('form') form;
    @ViewChild(CropperComponent) cropper: CropperComponent;

    public item: CGroup;
    public user: User;
    private cachebust: number = new Date().getTime();
    private subs;
    private formsub: boolean;

    constructor(
        private route: ActivatedRoute,
        private service: GroupService,
        private works: WorksService,
        private userservice: UserService,
        private tagsservice: TagsService,
        private uploadservice: UploaderService,
        private errors: ErrorService,
    ) {
        this.formsub = true;
        this.subs = [];
        let sub = route.params.subscribe(params => {
            this.userservice.get();
            service.getGroup(+params['id']).subscribe(i => {
                this.item = i;
                this.formsub = false;
                this.uploadservice.galleryid = 1;
            });
        });
        this.subs.push(sub);

        sub = this.userservice.user.subscribe(user => this.user = user);
        this.subs.push(sub);

        sub = uploadservice.uploadedFiles.subscribe(items => {
            this.service.append(this.item, items).subscribe(i => {
                this.item = i;
            });
        });
        this.subs.push(sub);
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    ngAfterViewChecked() {
        if (!this.formsub && this.item) {
            let sub = this.form.valueChanges.debounceTime(500).distinctUntilChanged().subscribe(() => this.save());
            this.subs.push(sub);
            this.formsub = true;
        }
    }

    back() {
        window.history.back();
    }

    save() {
        this.works.update(this.item).subscribe();
    }

    resetThumbnail() {
        this.works.upload(this.item, null, true).subscribe(item => {
            this.item = item;
            this.works.addItems([item]);
        }, error => this.errors.handleError(error));
    }
    cropThumbnail() {
        this.cropper.show();
    }
    reloadThumbnail(item: CGroup) {
        this.cachebust = new Date().getTime();
        this.item = item;
    }
    upload() {
        let element = <HTMLInputElement>event.srcElement;
        if (element.files.length) {
            this.works.upload(this.item, [element.files[0]]).subscribe(item => {
                this.item = item;
                this.works.addItems([item]);
            });
        }
    }

    removeTag(tag: Tag) {
        this.works.editTags([this.item], [], [tag]).subscribe(result => {
            this.item.tags = result[0].tags;
        }, error => this.errors.handleError(error));
    }
    addTag(event: any) {
        this.tagsservice.resolve(event.value).subscribe(tag => {
            if (tag) {
                let found = false;
                for (let t of this.item.tags) {
                    if (tag.id === t.id) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    this.works.editTags([this.item], [tag], []).subscribe(() => {
                        let tags = this.item.tags.splice(0);
                        tags.push(tag);
                        this.item.tags = tags;
                    }, error => this.errors.handleError(error));
                }
            }
            else {
                this.tagsservice.create(event.value).subscribe(t => {
                    this.works.editTags([this.item], [t], []).subscribe(() => {
                        let tags = this.item.tags.splice(0);
                        tags.push(t);
                        this.item.tags = tags;
                    }, error => this.errors.handleError(error));
                });
            }
        }, error => this.errors.handleError(error));
    }

    addFiles(event: Event) {
        let element = <HTMLInputElement>event.target;
        this.uploadservice.addFiles(element.files);
        element.value = null;
    }

    deleteGroup() {
        this.service.ungroup(this.item);
    }
}
