import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveHostDirective } from './remove-host.directive';

@Component({
    template: '<div id="parent" appRemoveHost><div id="child"></div></div>'
})
class TestComponent {
}

describe('RemoveHostDirective', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                RemoveHostDirective
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
    });

    it('should remove the parent', () => {
        const debugEl: HTMLElement = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(debugEl.firstElementChild.id).toEqual('child');
    });
});
