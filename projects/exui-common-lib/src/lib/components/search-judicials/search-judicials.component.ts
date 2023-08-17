import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { JudicialUserModel } from '../../models';
import { FindAPersonService } from '../../services/find-person/find-person.service';

@Component({
  selector: 'xuilib-search-judicials',
  templateUrl: './search-judicials.component.html',
  styleUrls: ['./search-judicials.component.scss']
})
export class SearchJudicialsComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  @Input() public control: AbstractControl;
  @Input() public disabled: boolean = null;
  @Input() public selectedJudicials: JudicialUserModel[] = [];
  @Input() public submitted?: boolean = true;
  @Input() public placeholderContent: string = '';
  @Input() public showAutocomplete: boolean = false;
  @Input() public displayedJudicials: JudicialUserModel[];
  @Output() public judicialChanged = new EventEmitter<JudicialUserModel>();
  @Input() public idValue: string = '';
  @Input() public errorMessage: string = 'You must select a name';
  @Input() public serviceId: string = '';
  @ViewChild('inputSelection', { read: ElementRef, static: true }) public autoCompleteInputBox: ElementRef<HTMLInputElement>;
  public selectedJudicial: JudicialUserModel;
  private readonly minSearchCharacters = 3;
  public keyUpSubject$: Subject<string> = new Subject();
  public searchInProgress: boolean = false;

  constructor(private readonly judicialService: FindAPersonService, fb: UntypedFormBuilder) {
    this.formGroup = fb.group({
      formControl: [null],
      selectedFormControl: [null]
    });
  }

  public ngOnInit(): void {
    this.displayedJudicials = [];
    if (this.control) {
      if (this.formGroup && this.formGroup.controls) {
        this.formGroup.controls.selectedFormControl = this.control;
        this.formGroup.controls.formControl.setValue(this.getControlValueDisplayText());
      }
    }
    this.keyUpSubject$.pipe(debounceTime(500)).subscribe(searchValue => this.search(searchValue as string));
  }

  public onKeyDown(): void {
    this.judicialChanged.emit();
  }

  public onKeyUp(event: any): void {
    this.showAutocomplete = false;
    this.keyUpSubject$.next(event.target.value);
  }

  public onFocus() {
    this.showAutocomplete = false;
  }

  public get displayedJudicialsDuplicationFiltered(): JudicialUserModel[] {
    return this.displayedJudicials.filter(
      judicial => !this.selectedJudicials.map(selectedJudicial => selectedJudicial.idamId).includes(judicial.idamId)
    );
  }

  public filter(term: string): void {
    this.searchJudicials(term, this.serviceId).pipe(
      mergeMap((apiData: JudicialUserModel[]) => {
        const apiFilter = apiData.filter(
          apiJudicial => !this.selectedJudicials.map(selectedJudicial => selectedJudicial.idamId).includes(apiJudicial.idamId)
        );
        this.displayedJudicials = apiFilter;
        this.searchInProgress = false;
        return apiFilter;
      })
    ).subscribe(judicial => {
      if (term === judicial.fullName) {
        this.formGroup.controls.selectedFormControl.setValue(judicial);
        this.displayedJudicials = [];
        this.judicialChanged.emit(judicial);
        this.showAutocomplete = false;
      }
      this.searchInProgress = false;
    });
  }

  public onSelectionChange(selection?: JudicialUserModel): void {
    if (this.formGroup.controls.formControl instanceof UntypedFormArray) {
      (this.formGroup.controls.selectedFormControl as UntypedFormArray).push(new UntypedFormControl(selection.idamId));
    } else {
      this.formGroup.controls.selectedFormControl.setValue(selection);
    }
    this.judicialChanged.emit(selection);
  }

  public search(currentValue: string): void {
    this.searchInProgress = true;
    this.showAutocomplete = !!currentValue && (currentValue.length >= this.minSearchCharacters);
    if (!!currentValue) {
      this.formGroup.controls.selectedFormControl.markAsDirty();
    } else {
      this.formGroup.controls.selectedFormControl.reset();
    }
    if (this.showAutocomplete) {
      this.filter(currentValue);
    } else {
      this.searchInProgress = false;
    }
  }

  public getDisplayName(selectedJudicial: JudicialUserModel): string {
    return `${selectedJudicial.fullName} (${selectedJudicial.emailId})`;
  }

  public searchJudicials(term: string, serviceId: string): Observable<JudicialUserModel[]> {
    return this.judicialService.searchJudicial(term, serviceId);
  }

  public getControlValueDisplayText(): string {
    return this.formGroup && this.formGroup.controls && this.formGroup.controls.selectedFormControl.value ?
      this.getDisplayName(this.formGroup.controls.selectedFormControl.value as JudicialUserModel) : '';
  }
}
