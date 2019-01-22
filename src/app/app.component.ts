import { Component } from '@angular/core';
import { Tasksline, Task } from './shared/tasksline.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tasksline: Tasksline[] = require('./shared/data-dummy.json');

  get taskslineIds(): string[] {
      return this.tasksline.map(item => item.id);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
      // In case the destination container is different from the previous container, we
      // need to transfer the given task to the target data array. This happens if
      // a task has been dropped on a different tasksline.
      if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
  }

  onTaskslineDrop(event: CdkDragDrop<Tasksline[]>) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }
}