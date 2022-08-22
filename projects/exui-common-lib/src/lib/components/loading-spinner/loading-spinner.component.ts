import { AfterContentChecked, ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'xuilib-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LoadingSpinnerComponent implements AfterContentChecked {
  @Input() public loadingText: string = 'Loading';

  constructor(private readonly ref: ChangeDetectorRef) {}

  // checks the data projected into the component
  public ngAfterContentChecked() {
    this.ref.detectChanges();
  }

}
