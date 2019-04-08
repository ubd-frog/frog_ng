import { TestBed } from '@angular/core/testing';

import { ReleaseNotesService } from './release-notes.service';

describe('ReleaseNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReleaseNotesService = TestBed.get(ReleaseNotesService);
    expect(service).toBeTruthy();
  });
});
