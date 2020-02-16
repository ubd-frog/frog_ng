import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeDialogComponent } from './badge-dialog.component';

describe('BadgeDialogComponent', () => {
  let component: BadgeDialogComponent;
  let fixture: ComponentFixture<BadgeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
