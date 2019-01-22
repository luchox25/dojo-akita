# Dojo akita
## Step 2
1. **Add and config akita** 
    * Add httpClient module in app.module.ts
        ```ts
        import { HttpClientModule } from '@angular/common/http';
        ```
        and
        ```ts
        imports: [
            ...
            HttpClientModule,
        ]
        ```
    * Add Reactive Forms in app.module.ts
        ```ts
        import { ReactiveFormsModule, FormsModule } from '@angular/forms';
        ```
        and
        ```
        imports: [
            ...
            FormsModule
        ]
        ```
    * Add Akita package
        ```bash
        npm install @datorama/akita --save
        ```
    * Add Akita schematics
        ```bash
        npm install akita-schematics --save-dev
        ```
    * Default Schematics collections
        ```bash
        ng config cli.defaultCollection akita-schematics
        ```
2. **Create your first state with Akita**
    * Run Akita schematics
        ```bash
        ng g akita-schematics:feature domain/tasksline
        ```
    * Edit tasksline.model.ts
        ```ts
        export interface Tasksline {
        id: string;
        title: string;
        color: string;
        tasks: Task[];
        }

        export interface Task {
        title: string;
        description: string;
        id: string;
        }

        /**
        * A factory function that creates Tasksline
        */
        export function createTasksline({id, title, color, tasks}: Partial<Tasksline>) {
        return {
            id,
            title,
            color,
            tasks
        } as Tasksline;
        }
        ```
    * Edit tasksline.store.ts
        ```ts
        export interface TaskslineState extends EntityState<Tasksline> {}

        const initialState: Tasksline = {
            id: 'tasksline-empty',
            title: 'blank',
            color: '#e0e0e0',
            tasks: []
        };

        @Injectable({ providedIn: 'root' })
        @StoreConfig({ name: 'tasksline' })
        export class TaskslineStore extends EntityStore<TaskslineState, Tasksline> {

        constructor() {
            super(initialState);
        }

        }
        ```
    * Edit app.component.html

        ```html
        <div class="add-section">
            <button (click)="showModal = true" class="button is-primary">Create Tasksline</button>
        </div>
        <div class="board" *ngIf="taskslines$ | async">
        <div class="card" style="width: 23.5%" [style.background-color]="line.color" *ngFor="let line of taskslines$ | async; let i=index">
            <div style="display: flex; justify-content: space-around;">
                    <header class="card-header" style="width: 100%">
                            <p class="card-header-title is-size-4">
                            {{line.title}}
                            </p>
                            <a (click)="setSelected(line)" class="card-header-icon" aria-label="more options">
                                    <span  class="icon" >
                                            <fa-icon [icon]="'plus'"></fa-icon>
                                        </span>
                                </a>
                        </header>
            </div>
            <div class="board__card-list__content" cdkDropList [id]="line.id" [cdkDropListData]="getTaskslineData(line.tasks)" [cdkDropListConnectedTo]="taskslineIds"
            (cdkDropListDropped)="onTaskDrop($event)">
            <div class="card card-list-item" *ngFor="let task of line.tasks" cdkDrag>
                <header class="card-header">
                    <p class="card-header-title">
                    {{ task.title }}
                    </p>
                </header>
                <div class="card-content" *ngIf="task.description">
                <div class="content">
                    {{ task.description }}
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        <div class="modal" [ngClass]="{'is-active': showModal}">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Create a tasksline
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <div class="field">
                                <label class="label">Taskline id</label>
                                <div class="control">
                                    <input [(ngModel)] ="newTasksline.id" class="input" type="text" placeholder="enter id">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Taskline title</label>
                                <div class="control">
                                    <input [(ngModel)]="newTasksline.title"  class="input" type="text" placeholder="enter title">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Taskline color</label>
                                <div class="control">
                                    <input [(ngModel)]="newTasksline.color" class="input" type="text" placeholder="enter hexadecimal color">
                                </div>
                                <p class="help">example #81d4fa</p>
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a (click)="saveTasksline()" class="card-footer-item">Save</a>
                    </footer>
                </div>
                    
            </div>
            <button (click)="showModal = false" class="modal-close is-large" aria-label="close"></button>
        </div>

        <div class="modal" *ngIf="showAddTask" [ngClass]="{'is-active': showAddTask}">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title">
                                Create a new task
                            </p>
                        </header>
                        <div class="card-content">
                            <div class="content">
                                <div class="field">
                                    <label class="label">Task id</label>
                                    <div class="control">
                                        <input [(ngModel)] ="newTask.id" class="input" type="text" placeholder="enter id">
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Task title</label>
                                    <div class="control">
                                        <input [(ngModel)]="newTask.title"  class="input" type="text" placeholder="enter title">
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Taskline color</label>
                                    <div class="control">
                                        <textarea [(ngModel)]="newTask.description" class="textarea" placeholder="enter a description">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <a (click)="saveNewTask()" class="card-footer-item">Save</a>
                        </footer>
                    </div>
                        
                </div>
                <button (click)="showAddTask = false" class="modal-close is-large" aria-label="close"></button>
            </div>
        ```

    * Edit app.component.ts
        ```ts
        import { Component, OnInit } from '@angular/core';
        import { Tasksline, Task } from './shared/tasksline.model';
        import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
        import { TaskslineService } from './domain/state/tasksline.service';
        import { Tasksline } from './domain/state/tasksline.model';
        import { Observable } from 'rxjs';
        import { TaskslineQuery } from './domain/state/tasksline.query';
        import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

        @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
        })
        export class AppComponent implements OnInit {
            public tasksline: Tasksline[];
            public taskslines$: Observable<Tasksline[]>;
            public showModal = false;
            public showAddTask = false;
            public newTasksline: Tasksline;
            public newTask: Task;
            public selectedTasksline: Tasksline;

            constructor(private _http: HttpClient,
                private _taskslineService: TaskslineService,
                private _tasklineQuery: TaskslineQuery) {
                this.tasksline = [];
                this.newTasksline = {
                    id: '',
                    title: '',
                    color: '',
                    tasks: []
                };

                this.newTask = {
                    id: '',
                    title: '',
                    description: ''
                };

            }

            ngOnInit() {
            this.taskslines$ = this._tasklineQuery.selectAll();
            this.taskslines$.subscribe((data: Tasksline[]) => {
                this.tasksline = data;
            });
            }

            get taskslineIds(): string[] {
                return this.tasksline.map(item => tasksline.id);
            }

            public getTaskslineData(tasks: Task[]): Task[] {
                return [...tasks];
            }

            onTaskDrop(event: CdkDragDrop<Task[]>) {
                // In case the destination container is different from the previous container, we
                // need to transfer the given task to the target data array. This happens if
                // a task has been dropped on a different block.
                if (event.previousContainer === event.container) {
                    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
                } else {
                transferArrayItem(event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
                }
            }

            onTaskslineDrop(event: CdkDragDrop<Block[]>) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            }

            public saveTasksline() {
                this._taskslineService.add(this.newTasksline);
                this.newTasksline = {
                id: '',
                title: '',
                color: '',
                tasks: []
                };
                this.showModal = false;
            }
            public setSelected(selected: Tasksline) {
                this.selectedTasksline = selected;
                this.showAddTask = true;
            }
            public async saveNewTask() {
                if (this.selectedTasksline) {
                let newTasksline = Object.assign({}, this.selectedTasksline);
                newTasksline.tasks = [ ...this.selectedTasksline.tasks ];
                newTasksline.tasks.push(this.newTask);
                this._taskslineService.update(newTasksline.id, newTasksline);
                this.newTask = {
                    id: '',
                    title: '',
                    description: ''
                };
                }
                this.showAddTask = false;
            }
        }
        ```
    * Edit app.component.scss
        ```scss
            :host {
                .board {
                    display: flex;
                    flex-direction: row;
                    height: 100vh;
                    justify-content: space-between;
                    padding: 2.5rem 1rem 1.5rem;
                    width: 100%;

                    &__card-list {
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                        padding: 16px;
                        width: 23.5%;

                        &__content {
                            width: 100%;
                        }
                    }
                }

                .card-list-item {
                    border-radius: 8px;
                    &:not(:last-child){
                        margin-bottom: 8px;
                    }
                }
            }
        ```
