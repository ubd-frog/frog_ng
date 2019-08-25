import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiteConfigService } from '../../shared/siteconfig.service';
import { SiteConfig } from '../../shared/models';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-siteconfig',
    templateUrl: './siteconfig.component.html',
    styleUrls: ['./siteconfig.component.css']
})
export class SiteconfigComponent implements OnInit {
    @ViewChild('file') file;

    public form: FormGroup;
    public favicon: any;
    private siteconfig: SiteConfig;

    constructor(
        private siteconfigservice: SiteConfigService,
        private fb: FormBuilder
    ) {
        this.form = fb.group({
            'name': ['', Validators.required],
            'link': '',
            'enable_likes': false,
            'default_gallery': 0,
            'favicon_file': null
        });
    }

    ngOnInit() {
        this.siteconfigservice.siteconfig.subscribe(siteconfig => {
            this.favicon = siteconfig.favicon;
            this.form.setValue({
                'name': siteconfig.name,
                'link': siteconfig.link,
                'enable_likes': siteconfig.enable_likes,
                'default_gallery': siteconfig.default_gallery,
                'favicon_file': null
            });
        });
    }

    addFiles() {
        this.file.nativeElement.click();
    }

    onFilesAdded(key: string) {
        this.form.patchValue({
            favicon_file: this.file.nativeElement.files[0]
        });

        const reader = new FileReader();
        reader.readAsDataURL(this.file.nativeElement.files[0]);
        reader.onload = (event) => {
            this.favicon = reader.result;
        }
    }

    save() {
        const value = this.form.value;
        const siteconfig = new SiteConfig();
        siteconfig.name = value.name;
        siteconfig.link = value.link;
        siteconfig.enable_likes = value.enable_likes;
        siteconfig.default_gallery = value.default_gallery;
        siteconfig.favicon = value.favicon;

        this.siteconfigservice.update(siteconfig, value.favicon_file);
    }

}
