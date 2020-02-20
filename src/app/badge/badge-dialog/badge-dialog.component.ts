import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Badge, BadgeService} from "../badge.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {SiteConfig, Tag} from "../../shared/models";


export class SmartComponent implements OnDestroy {
    protected subs: Subscription[];

    constructor() {
        this.subs = [];
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}


@Component({
    selector: 'badge-dialog',
    templateUrl: './badge-dialog.component.html',
    styleUrls: ['./badge-dialog.component.css']
})
export class BadgeDialogComponent extends SmartComponent implements OnInit {
    @ViewChild('file') file;

    public form: FormGroup;
    public badges$: Observable<Badge[]>;
    public tag: string;
    public badgeimage: any;
    public imageurl;
    public cache: Badge[];

    constructor(
        private badgeservice: BadgeService,
        private fb: FormBuilder,
    ) {
        super();

        this.tag = null;
        this.badgeimage = null;
        this.imageurl = null;

        this.form = this.fb.group({
            tag: ['', Validators.required],
            image: ['', Validators.required],
            image_file: null,
        });
    }

    ngOnInit() {
        // const sub = this.badgeservice.badges.subscribe(badges => this.cache = badges);
        // this.subs.push(sub);
        this.badges$ = this.badgeservice.badges;
    }

    selectBadge(badge: Badge) {
        this.form.setValue({
            tag: badge.tag.name,
            image: badge.image,
            image_file: null,
        });
        this.badgeimage = null;
        this.imageurl = badge.image;
    }

    setTag(tag: string) {
        this.tag = tag;
        const found = this.badgeservice.getByTag(tag);
        if (found) {
            this.selectBadge(found);
            return;
        }

        this.badgeimage = null;
        this.imageurl = null;
        this.form.patchValue({
            tag: tag,
            image: null,
        });
    }

    addFiles() {
        this.file.nativeElement.click();
    }

    onFilesAdded() {
        this.form.patchValue({
            image: this.file.nativeElement.files[0].name,
            image_file: this.file.nativeElement.files[0],
        });

        const reader = new FileReader();
        reader.readAsDataURL(this.file.nativeElement.files[0]);
        reader.onload = (event) => {
            this.badgeimage = reader.result;
        }
    }

    save() {
        const value = this.form.value;

        this.badgeservice.update(value.tag, value.image_file);
    }

    deleteBadge(badge: Badge) {
        this.badgeservice.delete(badge.id);
    }
}
