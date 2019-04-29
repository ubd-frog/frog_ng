import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { GalleryService } from '../../works/gallery.service';
import { Result } from '../../shared/models';



@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
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
