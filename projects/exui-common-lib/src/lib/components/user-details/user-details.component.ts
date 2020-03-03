import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models';

@Component({
    selector: 'xuilib-user-details',
    styleUrls: ['./user-details.component.scss'],
    templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {
    @Input() public user: User;
    @Input() public editPermissionRouterLink: string;
    @Input() public warningTitle: string;
    @Input() public isSuspended: boolean = false;
    @Output() public suspendUserEvent = new EventEmitter<void>();

    @Input() public readonly: boolean = true;
    @Input() public reinviteButton: boolean = false;
    @Output() public reinvite = new EventEmitter<string>();

    public hasSuspendUserButton = false;

    public ngOnInit() {
      this.hasSuspendUserButton = this.suspendUserEvent.observers.length > 0;
    }

    public reinviteClick(email: string): void {
        this.reinvite.emit(email);
    }

    public suspendUser(): void {
      this.suspendUserEvent.emit();
    }
}
