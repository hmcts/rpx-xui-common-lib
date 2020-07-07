import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';

@Component({
  selector: 'xuilib-share-case-confirm',
  templateUrl: './share-case-confirm.component.html',
  styleUrls: ['./share-case-confirm.component.scss']
})
export class ShareCaseConfirmComponent implements OnInit {

  @Input() public cases: SharedCase[] = []; // cases selected for sharing
  @Input() public changeLink: string = '';

  public state$: Observable<SharedCase[]>;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.state$ = this.stateService.state;
    this.stateService.setCases('0', this.cases);
  }

}
