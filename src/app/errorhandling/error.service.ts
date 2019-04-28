import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Result } from '../shared/models';
import { HttpClient } from '@angular/common/http';

// import { NotificationService } from '../notifications/notification.service';


@Injectable()
export class ErrorService {
    constructor(private http: HttpClient) {//, private notify: NotificationService) {

    }
    clientError(error: any) {
        let url = '/frog/clienterror/';
        let options = new RequestOptions();
        options.body = {
            error: error.zoneAwareStack || error
        };
        options.withCredentials = true;
        this.http.put(url, options).subscribe();
        this.handleError(null);
    }
    extractValue(res: Result) {
        if (res.isError) {
            // let notification = new Notification(res.message, 'error');
            // notification.error = true;
            // notification.timeout = 8000;
            // this.notify.add(notification);
            return null;
        }
        return res.value || null;
    }

    extractValues(res: Result) {
        if (res.isError) {
            // let notification = new Notification(res.message, 'error');
            // notification.error = true;
            // notification.timeout = 8000;
            // this.notify.add(notification);
            return [];
        }
        return res.values || [];
    }
    extractData(res: Result) {
        if (res.isError) {
            // let notification = new Notification(res.message, 'error');
            // notification.error = true;
            // notification.timeout = 8000;
            // this.notify.add(notification);
            return [];
        }
        return res || [];
    }
    handleError(error: any) {
        if (error === null) {
            return;
        }
        console.error(error);
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
        // let notification = new Notification(message, 'error');
        // notification.error = true;
        // notification.timeout = 8000;
        // this.notify.add(notification);
    }
}
