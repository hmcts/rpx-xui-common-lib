import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'removeduplicates'})
export class RemoveDuplicates implements PipeTransform {
  public transform(value: any[]): []{
    const filterArray = value.reduce((accumulator, current) => {
      if(!accumulator.some((item: any) => item.label === current.label)) {
        accumulator.push(current)
      }
      return accumulator
    }, [])
    return filterArray;
  }
}
