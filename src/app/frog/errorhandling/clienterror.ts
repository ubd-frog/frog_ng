import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { ErrorService } from './error.service';


@Injectable()
export class ClientError extends ErrorHandler {
    constructor(private injector: Injector) {
        super();
    }
    handleError(error: any): void {
        const service = this.injector.get(ErrorService);
        service.clientError(error);

        super.handleError(error);
    }
}
