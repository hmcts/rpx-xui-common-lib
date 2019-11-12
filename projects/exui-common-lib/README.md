# ExuiCommonLib

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.\
Exui-common-lib is used as common library for EXUI projects

## Code scaffolding

Run `ng generate component component-name --project exui-common-lib` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project exui-common-lib`.
> Note: Don't forget to add `--project exui-common-lib` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build exui-common-lib` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build exui-common-lib`, go to the dist folder `cd dist/exui-common-lib` and run `npm publish`.

## Running unit tests

Run `ng test exui-common-lib` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Usage
## Integration
Import ExuiCommonLibModule into your angular project module using the forRoot method:

```
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
@NgModule({
  imports: [
    ExuiCommonLibModule.forRoot()
  ],
```

To import ExuiCommonLibModule in lazy loaded modules, use the forChild method:

```
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';

@NgModule({
  imports: [
    ExuiCommonLibModule.forChild()
  ]
})
```

### Google Analytics
To use google analytics, inject GoogleAnalyticsService in your component, and call googleAnalyticService.init('Your google analytic key')

```
export class AppComponent {
  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
    this.googleAnalyticsService.init(config.googleAnalyticsKey);
  }
}
```

### Terms and Conditions
To display Terms and Conditions, import the Module as described above to get access to the following component:

```
<xuilib-terms-and-conditions [document]="your_tc_document"></xuilib-terms-and-conditions>
```

The document attribute should conform to the TCDocument interface that is exported as part of the library.
