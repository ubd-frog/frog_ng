import { Injectable } from '@angular/core';
import {Http, RequestOptions, Response } from "@angular/http";
import {NotificationService} from "../notifications/notification.service";
import { Notification } from '../shared/models';

@Injectable()
export class ErrorService {
    constructor(private http: Http, private notify: NotificationService) {

    }
    clientError(error: any) {
        console.error(error);
        let url = '/frog/clienterror/';
        let options = new RequestOptions();
        options.body = {
            error: error.toString()
        };
        options.withCredentials = true;
        this.http.put(url, options).subscribe();
        this.handleError(null);
    }
    extractValue(res: Response) {
        let body = res.json();
        if (body.isError) {
            let notification = new Notification(body.message, 'error');
            notification.error = true;
            notification.timeout = 8000;
            this.notify.add(notification);
            return null;
        }
        return body.value || null;
    }

    extractValues(res: Response) {
        let body = res.json();
        if (body.isError) {
            let notification = new Notification(body.message, 'error');
            notification.error = true;
            notification.timeout = 8000;
            this.notify.add(notification);
            return [];
        }
        return body.values || [];
    }
    handleError(error: any) {
        if (error === null) {
            return;
        }
        console.log(error);
        let message = 'An error has occurred and top men are on it...Top Men';
        if (error.hasOwnProperty('status') && error.hasOwnProperty('url')) {
            // Response error
            if (error.status >= 400 && error.status < 500) {
                // Use the error body for the message
                message = error.statusText;
            }
        }
        else {
            // Client error
            this.clientError(error);
        }
        let notification = new Notification(message, 'error');
        notification.error = true;
        notification.timeout = 8000;
        this.notify.add(notification);
    }
}
