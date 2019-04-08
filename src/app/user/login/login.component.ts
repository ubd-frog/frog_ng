import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { GalleryService } from '../works/gallery.service';
import {Result} from "../shared/models";


@Component({
    templateUrl: './html/login.html',
    styles: [
        'body { font-family: Helvetica;background: #333;-webkit-font-smoothing: antialiased; }',
        'form { width: 380px;margin: 4em auto;padding: 3em 2em 2em 2em;background: #666;border: 1px solid #777;box-shadow: rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px; }',
        'footer { text-align: center; }',
        'section { text-align:center; margin-top: 4em; }',
        '.input-field label { color: #9e9e9e; }',
        '.input-field input:focus + label { color: #8bc34a; }',
        '.input-field input:focus { border-bottom: 1px solid #8bc34a; box-shadow: 0 1px 0 0 #689f38; }',
        '.input-field input.valid { border-bottom: 1px solid #8bc34a; box-shadow: 0 1px 0 0 #689f38; }',
        '.input-field input.invalid { border-bottom: 1px solid #8bc34a; box-shadow: 0 1px 0 0 #689f38; }',
        '.input-field .active { color: #8bc34a; }',
    ]
})
export class LoginComponent implements OnInit {
    public email: string;
    public password: string;
    public message: string;
    public csrftoken: string;

    constructor(private service: UserService, private galleryservice: GalleryService, private router: Router) {
        service.csrf().subscribe();
        this.email = '';
        this.password = '';
        this.message = '';
        this.csrftoken = '';
    }
    ngOnInit() { }
    clickHandler() {
        this.service.login(this.email, this.password).subscribe(response => {
            response = response as Result;
            if (response.isError) {
                this.message = response.message;
            }
            else {
                this.galleryservice.get();
                this.router.navigate(['/w/1']);
            }
        }, error => console.log(`Could not log you in: ${error}`));
    }
}
