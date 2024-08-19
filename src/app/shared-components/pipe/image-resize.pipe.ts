import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageResize'
})
export class ImageResizePipe implements PipeTransform {
  transform(url: string, size: string = '640x400'): string {
    return url.replace('{size}', size);
  }
}
