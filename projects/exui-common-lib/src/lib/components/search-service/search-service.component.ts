import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FilterConfigOption } from "../../models";

@Component({
  selector: "exui-search-service",
  templateUrl: "./search-service.component.html",
  styleUrls: ["./search-service.component.scss"],
})
export class SearchServiceComponent {
  @Input() public services: FilterConfigOption[] = [] ;
  @Output() public serviceChanged: EventEmitter<FilterConfigOption> = new EventEmitter<FilterConfigOption>();
  
  public onSelectionChanged(key: string): void {
    const selectedService = this.services.find(s => s.key === key);
    this.serviceChanged.emit(selectedService);
  }
}
