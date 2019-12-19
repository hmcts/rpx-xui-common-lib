import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeatureToggleService } from '../../services';

@Directive({
    selector: '[xuilibFeatureToggle]'
})
export class FeatureToggleDirective implements OnDestroy {
    private feature: string;
    private subscription: Subscription;

    @Input() public set xuilibFeatureToggle(feature: string) {
        this.feature = feature;
        this.updateSubscription();
    }

    constructor(
        private readonly service: FeatureToggleService,
        private readonly viewContainer: ViewContainerRef,
        private readonly templateRef: TemplateRef<any>
    ) {}

    public ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private updateSubscription() {
        this.subscription = this.service.isEnabled(this.feature).subscribe(enabled => {
            if (enabled) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainer.clear();
            }
        });
    }
}
