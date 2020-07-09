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

  public shareCases: SharedCase[] = []; // cases selected for sharing

  @Input() public shareCases$: Observable<SharedCase[]>;
  @Input() public changeLink: string = '';

  public state$: Observable<SharedCase[]>;

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.shareCases$.subscribe(shareCases => {
      this.shareCases = shareCases;
      this.stateService.setCases(shareCases);
    });
    this.shareCases$ = this.stateService.state;
  }

}
