import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';

@Component({
  selector: 'xuilib-share-case-confirm',
  templateUrl: './share-case-confirm.component.html',
  styleUrls: ['./share-case-confirm.component.scss']
})
export class ShareCaseConfirmComponent implements OnInit {

  @Input() public cases: SharedCase[] = []; // cases selected for sharing
  @Input() public users: UserDetails[] = []; // users of this organisation the cases can be shared with

  @Output() public unselect = new EventEmitter<SharedCase>();

  public state$: Observable<SharedCase[]>;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.state$ = this.stateService.state;
    this.stateService.setCases('0', this.cases);
  }

  public onUnselect(c: SharedCase): void {
    this.unselect.emit(c);
    this.stateService.removeCase(c.caseId);
  }

  public isDisabledContinue() {
    return true;
  }

}
