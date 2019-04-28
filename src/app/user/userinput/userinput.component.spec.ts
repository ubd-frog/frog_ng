import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInputComponent } from './userinput.component';

describe('UserinputComponent', () => {
    let component: UserInputComponent;
    let fixture: ComponentFixture<UserInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserInputComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
