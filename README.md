# Dojo akita
## Step 1
1. **Start project** 
    * clone and install dependencies
        ```bash
        git clone https://github.com/luchox25/dojo-akita.git && cd dojo-akita && npm i
        ```

2. **install and configure angular cdk to enable drag and drop api**
    * install @angular/cdk
        ```bash
        npm install @angular/cdk --save
        ```

    * Add @angular/cdk module to app.module
        ```ts
        import { DragDropModule } from '@angular/cdk/drag-drop';
        ```
        and
        ```ts
        imports: [
            ...
            DragDropModule
        ]
        ```
3. **Add styles and icons for our application**
    * install bulma css and font awesome icons
        ```bash
        npm install bulma @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons --save
        ```
	* Add stylesheet to angular.json
        ```json
        "styles": [
            ...
            "./node_modules/bulma/css/bulma.css"
        ]
        ```
	* add svg icons in app.module
        ```ts
        import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
        import { library } from "@fortawesome/fontawesome-svg-core";
        import { fas } from "@fortawesome/free-solid-svg-icons";
        library.add(fas);
        ```
        and
        ```ts
        imports: [
            ...
            FontAwesomeModule,
        ]
        ```
4. **Create and load data dummy**
	* install package to load data dummy
        ```bash
        npm install @types/node --save-dev
        ```
	* add types in tsconfig.app.json
        ```json
        "compilerOptions": {
            ...
            "types": ["node"]
        }
        ...
        ```
    * create a new sub-directory
        ```bash
        mkdir  src/app/shared
        ``` 
	* create data-dummy.json in shared folder...
        ```json
        [
            {
                "title": "Todo",
                "id": "todo",
                "color": "#b2ebf2",
                "tasks": [
                    {
                    "id": "first-task",
                    "title": "First Task",
                    "description": "This is my first task"
                    }
                ]
            },
            {
                "title": "In Progress",
                "id": "inprogress",
                "color": "#ffa726",
                "tasks": [
                    {
                    "id": "second-task",
                    "title": "Second Task",
                    "description": "This is my first task"
                    }
                ]
            },
            {
                "title": "Done",
                "id": "ddone",
                "color": "#fff176",
                "tasks": [
                    {
                    "id": "third-task",
                    "title": "Third Task",
                    "description": "This is my first task"
                    }
                ]
                },
            {
                "title": "QA Approved",
                "id": "qaapproved",
                "color": "#aed581",
                "tasks": [
                    {
                    "id": "four-task",
                    "title": "Four Task",
                    "description": "This is my first task"
                    }
                ]
            }
        ]
        ```
  
    * create the model tasksline.model.ts in shared folder
        ```ts 
        export interface Tasksline {
            title: string;
            id: string;
            color: string;
            tasks: Task[];
        }

        export interface Task {
            title: string;
            description: string;
            id: string;
        }
        ```
            
5. **Edit App component**
    * edit app.component.ts
        ```ts
        import { Tasksline, Task } from './shared/tasksline.model';
        import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
        ```
        and
        ```ts
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
        ```
    * edit app.component.html 
        ```html
        <div class="board">
            <div class="board__card-list" [style.background-color]="line.color" *ngFor="let line of tasksline; let i=index">
                <h2 cdkDragHandle class="title is-size-4">{{line.title}}</h2>
                <div class="board__card-list__content" cdkDropList [id]="line.id" [cdkDropListData]="line.tasks" [cdkDropListConnectedTo]="taskslineIds"
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

