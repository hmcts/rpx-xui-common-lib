import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';

@Component({
  selector: 'xuilib-selected-case-list',
  templateUrl: './selected-case-list.component.html',
  styleUrls: ['./selected-case-list.component.scss']
})
export class SelectedCaseListComponent implements OnInit {

  public shareCases: SharedCase[] = [];

  @Input() public shareCases$: Observable<SharedCase[]>;

  @Input() public removeUserFromCaseToggleOn: boolean;

  @Input() public toConfirm: boolean = false;

  @Input() public changeLink: string = '';

  @Output() public unselect = new EventEmitter<SharedCase>();
  @Output() public synchronizeStore = new EventEmitter<SharedCase>();

  constructor(private readonly stateService: CaseSharingStateService) { }

  public ngOnInit() {
    this.shareCases$ = this.stateService.state;
    this.shareCases$.subscribe(shareCases => this.shareCases = shareCases);
  }

  public onUnselect(sharedCase: SharedCase): void {
    this.unselect.emit(sharedCase);
  }

  public onSynchronizeStore(event: any): void {
    this.synchronizeStore.emit(event);
  }

  public trackByCaseId(sharedCase: SharedCase): string {
    return sharedCase.caseId;
  }
}
