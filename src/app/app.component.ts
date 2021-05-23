import { Component, OnInit } from '@angular/core';
import { BadgeColour, ContactDetailsDataModel, FilterConfig, TCDocument } from 'projects/exui-common-lib/src';
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
    badgeColour: BadgeColour.RED,
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
  // START: Checkbox List Component properties.
  public twickers: CheckboxLocation = {value: 6, name: 'Twickenham', borough: 'Richmond'};
  // END: Due Date Component properties.
  public wimbledon: CheckboxLocation = {value: 8, name: 'Wimbledon', borough: 'Merton'};
  public goldersGreen: CheckboxLocation = {value: 9, name: 'Golders Green', borough: 'Barnet'};
  public locations: CheckboxLocation[] = [
    {value: 1, name: 'Baker Street', borough: 'Westminster'},
    {value: 2, name: 'Clapham Junction', borough: 'Wandsworth'},
    {value: 3, name: 'King\'s Cross', borough: 'Camden'},
    {value: 4, name: 'Shoreditch High Street', borough: 'Tower Hamlets'},
    {value: 5, name: 'South Woodford', borough: 'Redbridge'},
    this.twickers,
    {value: 7, name: 'West Brompton', borough: 'Kensington and Chelsea'}
  ];
  public preselection: CheckboxLocation[] = [this.twickers];
  public listHeight: string = '000';
  public checkboxEvents: string = '';
  public labelFunction: (item: CheckboxLocation) => string;
  public testObservable: Observable<string[]> = of(['this', 'is', 'a', 'test']);
  // START: Generic Filter Component.
  public filterConfig: FilterConfig = {
    id: 'examples',
    fields: [{
      name: 'example1',
      options: [
        {key: 'Fernando Alonso', label: 'Fernando Alonso'},
        {key: 'Sebastian Vettel', label: 'Sebastian Vettel'},
        {key: 'Lewis Hamilton', label: 'Lewis Hamilton'},
        {key: 'Mick Schumacher', label: 'Mick Schumacher'},
        {key: 'Lando Norris', label: 'Lando Norris'},
      ],
      minSelected: 1,
      maxSelected: 1,
      type: 'checkbox'
    }, {
      name: 'example2',
      options: [
        {key: 'Tinky Winky', label: 'Tinky Winky'},
        {key: 'Dipsy', label: 'Dipsy'},
        {key: 'Laa-Laa', label: 'Laa-Laa'},
        {key: 'Po', label: 'Po'},
        {key: 'Noo-noo', label: 'Noo-noo'},
      ],
      minSelected: 1,
      maxSelected: 1,
      type: 'radio'
    }, {
      name: 'example3',
      options: [
        {key: 'yellow', label: 'Yellow'},
        {key: 'green', label: 'Green'},
        {key: 'red', label: 'Red'},
        {key: 'blue', label: 'Blue'},
        {key: 'orange', label: 'Orange'},
      ],
      minSelected: 1,
      maxSelected: 1,
      type: 'select'
    }],
    persistence: 'local',
    applyButtonText: 'apply',
    cancelButtonText: 'cancel'
  };

  constructor(
    private readonly googleTagManagerService: GoogleTagManagerService
  ) {
  }

  // END: Checkbox List Component properties.

  public get wimbledonAdded(): boolean {
    return this.locations.includes(this.wimbledon);
  }

  public get goldersGreenAdded(): boolean {
    return this.locations.includes(this.goldersGreen);
  }

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

  // END: Due Date Component functions.

  public tabChangeEvent(eventObject: any) {
    console.log(eventObject);
  }

  // START: Checkbox List Component functions.
  public labelName = (item: CheckboxLocation): string => {
    return item.name;
  }

  public labelBorough = (item: CheckboxLocation): string => {
    return item.borough;
  }

  public setLabelFunction(fn: (item: CheckboxLocation) => string): void {
    this.labelFunction = fn;
  }

  public onCheckboxSelectionChange(selection: CheckboxLocation[]): void {
    let thisEvent: string = 'Selection changed to:\n * ';
    thisEvent += selection.map(item => this.labelFunction(item)).join(', ');
    console.log(thisEvent, selection);
    this.checkboxEvents += `\n\n${thisEvent}`;
  }

  public addLocation(location: CheckboxLocation): void {
    if (!this.locations.includes(location)) {
      this.locations = [...this.locations, location];
    }
  }

  // END: Checkbox List Component functions.

  public removeLocation(location: CheckboxLocation): void {
    if (this.locations.includes(location)) {
      this.locations.splice(this.locations.indexOf(location), 1);
      this.locations = [...this.locations];
    }
  }

  // END: Generic Filter Component.

  public spinnerTester: boolean = false;

  public ngOnInit() {
    // TODO: gtm key here will give 404 as it doesn't have a container
    this.googleTagManagerService.init('GTM-1234');
    this.setLabelFunction(this.labelName);
  }
}
