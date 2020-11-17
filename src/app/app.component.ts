import { Component, OnInit } from '@angular/core';
import { BadgeColour, ContactDetailsDataModel, TCDocument } from 'projects/exui-common-lib/src';
import { GoogleTagManagerService } from 'projects/exui-common-lib/src/lib/services/google-tag-manager/google-tag-manager.service';
import { Observable, of } from 'rxjs';

interface CheckboxLocation {
  value: number;
  name: string;
  borough: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly googleTagManagerService: GoogleTagManagerService
  ) { }
  public title = 'rpx-xui-common-lib';

  public testDocumentPlain: TCDocument = {
    version: 1,
    content: 'Test Document Content',
    mimeType: 'text/plain'
  };

  public testDocumentHtml: TCDocument = {
    version: 2,
    content: `<h1>HTML Test</h1><p>Document to test <b>HTML</b> content</p>`,
    mimeType: 'text/html'
  };

  public contactDetailsData: ContactDetailsDataModel = {
    title: 'Contact Details Component',
    badgeColour: BadgeColour.BADGE_RED,
    badgeText: 'PRIVATE BETA',
    email: 'test@justice.gov.uk',
    phone: '1111111',
    openingTimes: 'bla bla bla'
  };

  public tabItems = [{
    text: 'Tab1'
  }, {
    text: 'Tab2'
  }];

  // START: Due Date Component properties.
  public dueDate: Date = new Date();
  public dueDateText: string = this.dueDate.toLocaleDateString();
  public highUrgencyCutoff: number = 0;
  public highUrgencyCutoffText: string = '0';
  public mediumUrgencyCutoff: number = 2;
  public mediumUrgencyCutoffText: string = '2';
  // END: Due Date Component properties.

  // START: Checkbox List Component properties.
  public twickers: CheckboxLocation = { value: 6, name: 'Twickenham', borough: 'Richmond' };
  public wimbledon: CheckboxLocation = { value: 8, name: 'Wimbledon', borough: 'Merton' };
  public goldersGreen: CheckboxLocation = { value: 9, name: 'Golders Green', borough: 'Barnet' };
  public locations: CheckboxLocation[] = [
    { value: 1, name: 'Baker Street', borough: 'Westminster' },
    { value: 2, name: 'Clapham Junction', borough: 'Wandsworth' },
    { value: 3, name: 'King\'s Cross', borough: 'Camden' },
    { value: 4, name: 'Shoreditch High Street', borough: 'Tower Hamlets' },
    { value: 5, name: 'South Woodford', borough: 'Redbridge' },
    this.twickers,
    { value: 7, name: 'West Brompton', borough: 'Kensington and Chelsea' }
  ];
  public preselection: CheckboxLocation[] = [ this.twickers ];
  public listHeight: string = '000';
  public checkboxEvents: string = '';
  public get wimbledonAdded(): boolean {
    return this.locations.includes(this.wimbledon);
  }
  public get goldersGreenAdded(): boolean {
    return this.locations.includes(this.goldersGreen);
  }
  // END: Checkbox List Component properties.

  public testObservable: Observable<string[]> = of(['this', 'is', 'a', 'test']);


  // START: Due Date Component functions.
  public updateDueDate(value: string): void {
    const parts: string[] = value.split('/');
    if (parts.length === 3) {
      const parsedDate: number = Date.parse(parts.reverse().join('-'));
      if (isNaN(parsedDate) === false) {
        this.dueDate = new Date(parsedDate);
      }
    }
  }
  public updateHighUrgencyCutoff(value: string): void {
    this.highUrgencyCutoff = parseInt(value, 10);
  }
  public updateMediumUrgencyCutoff(value: string): void {
    this.mediumUrgencyCutoff = parseInt(value, 10);
  }

  public tabChangeEvent(eventObject: any) {
    console.log(eventObject);
  }
  // END: Due Date Component functions.

  // START: Checkbox List Component functions.
  public labelFunction(item: CheckboxLocation): string {
    return item.name;
  }
  public onCheckboxSelectionChange(selection: CheckboxLocation[]): void {
    let thisEvent: string = 'Selection changed to:\n * ';
    thisEvent += selection.map(item => this.labelFunction(item)).join(', ');
    console.log(thisEvent, selection);
    this.checkboxEvents += `\n\n${thisEvent}`;
  }
  public addLocation(location: CheckboxLocation): void {
    if (!this.locations.includes(location)) {
      this.locations = [ ...this.locations, location ];
    }
  }
  public removeLocation(location: CheckboxLocation): void {
    if (this.locations.includes(location)) {
      this.locations.splice(this.locations.indexOf(location), 1);
      this.locations = [ ...this.locations ];
    }
  }
  // END: Checkbox List Component functions.

  public ngOnInit() {
    // TODO: gtm key here will give 404 as it doesn't have a container
    this.googleTagManagerService.init('GTM-1234');
  }
}
