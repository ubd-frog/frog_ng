import { TestBed } from '@angular/core/testing';

import { ReleaseNotesService } from './releasenotes.service';

describe('ReleasenotesService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ReleaseNotesService = TestBed.get(ReleaseNotesService);
        expect(service).toBeTruthy();
    });
});
