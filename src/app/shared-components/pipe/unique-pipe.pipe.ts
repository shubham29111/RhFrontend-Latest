import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipePipe implements PipeTransform {
  transform(value: any[]): any[] {
    return value ? [...new Set(value)] : [];
  }
}