import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from './user.service';

@Component({
    template: ''
})
export class LogoutComponent implements OnInit {
    constructor(private service: UserService, private router: Router) {
        
    }

    ngOnInit() {
        this.service.logout().subscribe(response => {
            this.router.navigate(['/login']);
        }, error => console.log(`Could not log you out: ${error}`));
    }
}