import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';

@Component({
    selector: 'xuilib-share-case-confirm',
    templateUrl: './share-case-confirm.component.html',
    styleUrls: ['./share-case-confirm.component.scss'],
    standalone: false
})
export class ShareCaseConfirmComponent implements OnInit, OnDestroy {
  public shareCases: SharedCase[] = []; // cases selected for sharing

  @Input() public shareCases$: Observable<SharedCase[]>;
  @Input() public changeLink: string = '';
  @Input() public completeLink: string = '';
  @Input() public acceptCases?: boolean = false; // flag to indicate if the cases are being accepted

  public state$: Observable<SharedCase[]>;
  private subscriptions: Subscription = new Subscription();

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.subscriptions.add(
      this.shareCases$.subscribe((shareCases) => {
        this.shareCases = shareCases;
        this.stateService.setCases(shareCases);
      })
    );
    this.shareCases$ = this.stateService.state;
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
