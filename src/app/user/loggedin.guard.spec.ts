import { TestBed, async, inject } from '@angular/core/testing';

import { LoggedInGuard } from './loggedin.guard';

describe('LoggedInGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoggedInGuard]
        });
    });

    it('should ...', inject([LoggedInGuard], (guard: LoggedInGuard) => {
        expect(guard).toBeTruthy();
    }));
});
