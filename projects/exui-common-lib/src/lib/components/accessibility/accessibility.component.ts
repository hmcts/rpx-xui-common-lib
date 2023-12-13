import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xuilib-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})

export class AccessibilityComponent implements OnInit {
  public isEndpointMC: boolean;
  constructor() {
  }

  public ngOnInit(): void {
    const urlRef = window.location.href;
    // pointing to MC & preview. May need to refactor this if needed for
    // more applications
    if (urlRef.includes('manage-case')
      || urlRef.includes('xui-webapp')) {
      this.isEndpointMC = true;
    } else {
      // pointing to MO.
      this.isEndpointMC = false;
    }
  }
}
