import { TestBed } from '@angular/core/testing';

import { SiteConfigService } from './siteconfig.service';

describe('SiteConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SiteConfigService = TestBed.get(SiteConfigService);
        expect(service).toBeTruthy();
    });
});
