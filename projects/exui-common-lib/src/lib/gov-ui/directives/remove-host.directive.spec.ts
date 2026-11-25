import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveHostDirective } from './remove-host.directive';

@Component({
    template: '<div id="parent" appRemoveHost><div id="child"></div></div>',
    standalone: false
})
class TestComponent {
}

@Component({
    template: '<section id="multiple-parent"><div appRemoveHost><span id="first">First</span>text<span id="second">Second</span></div><span id="sibling">Sibling</span></section>',
    standalone: false
})
class MultipleChildrenComponent {
}

@Component({
    template: '<div id="empty-parent"><div appRemoveHost></div></div>',
    standalone: false
})
class EmptyHostComponent {
}

describe('RemoveHostDirective', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                MultipleChildrenComponent,
                EmptyHostComponent,
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

    it('should move every child out while preserving element order', () => {
        const multipleFixture = TestBed.createComponent(MultipleChildrenComponent);

        multipleFixture.detectChanges();

        const parent = multipleFixture.nativeElement.querySelector('#multiple-parent') as HTMLElement;
        expect(Array.from(parent.children).map(child => child.id)).toEqual(['first', 'second', 'sibling']);
        expect(parent.textContent).toContain('FirsttextSecondSibling');
    });

    it('should remove an empty host without removing its parent', () => {
        const emptyFixture = TestBed.createComponent(EmptyHostComponent);

        emptyFixture.detectChanges();

        const parent = emptyFixture.nativeElement.querySelector('#empty-parent') as HTMLElement;
        expect(parent).toBeTruthy();
        expect(parent.children.length).toBe(0);
        expect(parent.querySelector('[appRemoveHost]')).toBeNull();
    });
});
