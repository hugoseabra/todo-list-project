import {AfterInsert, AfterRemove, AfterUpdate} from "typeorm";

export class TodoistProjectHookMixin {
  @AfterInsert
  @AfterUpdate
  updateTodoistProject() {
    
  }

  @AfterRemove
  removeTodoistProject() {

  }
}

export class TodoistTaskHookMixin {
  @AfterInsert
  @AfterUpdate
  updateTodoistProject() {

  }

  @AfterRemove
  removeTodoistProject() {

  }
}
