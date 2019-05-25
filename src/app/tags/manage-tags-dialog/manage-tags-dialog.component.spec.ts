import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTagsDialogComponent } from './manage-tags-dialog.component';

describe('ManageTagsDialogComponent', () => {
  let component: ManageTagsDialogComponent;
  let fixture: ComponentFixture<ManageTagsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTagsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
