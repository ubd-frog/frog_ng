import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasenotesDialogComponent } from './releasenotes-dialog.component';

describe('ReleasenotesDialogComponent', () => {
  let component: ReleasenotesDialogComponent;
  let fixture: ComponentFixture<ReleasenotesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasenotesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasenotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
