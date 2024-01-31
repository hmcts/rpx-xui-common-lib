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
    // pointing to MC & preview. May need to refactor this if
    // more applications added than MO & MC
    if (urlRef.includes('manage-case')
      || urlRef.includes('xui-webapp')
      && !urlRef.includes('xui-mo-webapp')) {
      this.isEndpointMC = true;
    } else {
      this.isEndpointMC = false;
    }
  }
}