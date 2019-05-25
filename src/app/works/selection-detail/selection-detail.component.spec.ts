import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionDetailComponent } from './selection-detail.component';

describe('SelectionDetailComponent', () => {
  let component: SelectionDetailComponent;
  let fixture: ComponentFixture<SelectionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
