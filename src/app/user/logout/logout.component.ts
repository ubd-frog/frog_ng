import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';


@Component({
    template: ''
})
export class LogoutComponent {
    constructor(private service: UserService, private router: Router) {
        this.service.logout().subscribe(response => {
            this.router.navigate(['/']);
        }, error => console.log(`Could not log you out: ${error}`));
    }
}
