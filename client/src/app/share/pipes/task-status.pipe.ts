import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskStatus',
  standalone: false
})
export class TaskStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
