import { Component, Input, OnInit } from '@angular/core';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'xuilib-selected-case-confirm',
  templateUrl: './selected-case-confirm.component.html',
  styleUrls: ['./selected-case-confirm.component.scss']
})
export class SelectedCaseConfirmComponent implements OnInit {

  @Input() public sharedCase: SharedCase;
  @Input() public changeLink: string = '';

  public shareCases: SharedCase[];
  public shareCases$: Observable<SharedCase[]>;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.shareCases$ = this.stateService.state;
    this.shareCases$.subscribe(shareCases => this.shareCases = shareCases);
  }

  public trackByUserId(user: UserDetails): string {
    return user.idamId;
  }

}
