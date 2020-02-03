import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

export class LetContext<T = unknown> {
    public $implicit: T = null;
    public ngLet: T = null;
}

@Directive({
    selector: '[xuilibLet]'
})
export class LetDirective<T = unknown> {
    private readonly context: LetContext<T> = new LetContext<T>();

    constructor(private readonly viewContainer: ViewContainerRef, templateRef: TemplateRef<LetContext<T>>) {
        this.viewContainer.createEmbeddedView(templateRef, this.context);
    }

    @Input() public set xuilibLet(condition: T) {
        this.context.$implicit = this.context.ngLet = condition;
    }
}
