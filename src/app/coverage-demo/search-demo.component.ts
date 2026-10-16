import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JudicialUserModel, Person, PersonRole } from 'projects/exui-common-lib/src/public-api';
import { judicialPeople, judicialUsers } from './search-demo.data';

@Component({
  selector: 'app-search-demo',
  templateUrl: './search-demo.component.html',
  standalone: false
})
export class SearchDemoComponent {
  public readonly feature: string;
  public readonly domain: PersonRole;
  public readonly excludeSelected: boolean;
  public readonly personGroup = new FormGroup({});
  public readonly judicialControl = new FormControl<JudicialUserModel | null>(null);
  public readonly selectedPeople = [judicialPeople[1]];
  public readonly selectedJudicials = [judicialUsers[1]];
  public readonly peopleSelected: Person[] = [];
  public readonly judicialsSelected: JudicialUserModel[] = [];

  constructor(route: ActivatedRoute) {
    const query = route.snapshot.queryParamMap;
    const domains: Record<string, PersonRole> = {
      judicial: PersonRole.JUDICIAL,
      all: PersonRole.ALL,
      legal: PersonRole.LEGAL_OPERATIONS,
      admin: PersonRole.ADMIN,
      ctsc: PersonRole.CTSC
    };

    this.feature = query.get('feature') || 'person';
    this.domain = domains[query.get('domain') || 'judicial'] ?? PersonRole.JUDICIAL;
    this.excludeSelected = query.get('exclude') === 'true';
  }

  public recordPerson(person: Person): void {
    if (person) {
      this.peopleSelected.push(person);
    }
  }

  public recordJudicial(judicial: JudicialUserModel): void {
    if (judicial) {
      this.judicialsSelected.push(judicial);
    }
  }
}
