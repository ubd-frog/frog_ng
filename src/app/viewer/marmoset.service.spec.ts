import { TestBed } from '@angular/core/testing';

import { MarmosetService } from './marmoset.service';

describe('MarmosetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarmosetService = TestBed.get(MarmosetService);
    expect(service).toBeTruthy();
  });
});
