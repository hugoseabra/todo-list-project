import {Injectable} from "@nestjs/common";

import {
  AddProjectArgs,
  Project,
  Task,
  TodoistApi,
  UpdateProjectArgs,
  UpdateTaskArgs
} from '@doist/todoist-api-typescript'
import {BoardDTO, TaskDTO} from "@apps/todo/dto";
import {AddTaskArgs} from "@doist/todoist-api-typescript/dist/types/requests";


@Injectable()
export class TodoistService {
  protected client: TodoistApi;

  constructor(apiToken: string) {
    this.client = new TodoistApi(apiToken);
  }

  async updateBoard(board: BoardDTO): Promise<string> {
    const isNew = !board.todoistProjectId;
    let project: Project;

    if (isNew) {
      const data: AddProjectArgs = {name: board.name}
      project = await this.client.addProject(data);
      board.todoistProjectId = project.id;
      return project.id;
    }

    project = await this.client.getProject(board.todoistProjectId);
    if (!project) {
      `Project could not be found with id ${board.todoistProjectId}. Board: ${board.id}`
    }

    const updateData: UpdateProjectArgs = {name: board.name};
    await this.client.updateProject(project.id, updateData);
    return project.id;
  }

  async syncBoard(board: BoardDTO): Promise<BoardDTO> {
    if (!board.todoistProjectId) {
      return;
    }
    const project: Project = await this.client.getProject(board.todoistProjectId);
    if (!project) {
      throw new Error(
        `Project could not be found with id ${board.todoistProjectId}. Board: ${board.id}`
      )
    }

    board.name = project.name;
    return board;
  }

  async removeProject(id: string): Promise<void> {
    await this.client.deleteProject(id)
  }

  async updateTask(task: TaskDTO): Promise<string> {
    const isNew = !task.todoistTaskId;
    let todoistTask: Task;

    if (isNew) {
      const data: AddTaskArgs = {
        description: task.name,
        content: task.note,
        projectId: task.board.todoistProjectId,
        order: task.order,
      }
      todoistTask = await this.client.addTask(data);
      task.todoistTaskId = todoistTask.id;
      return todoistTask.id;
    }

    todoistTask = await this.client.getTask(task.todoistTaskId);
    if (!todoistTask) {
      throw new Error(
        `Task could not be found with id ${task.todoistTaskId}.
         Board: ${task.board.id}. Task: ${task.id}`
      )
    }

    const updateData: UpdateTaskArgs = {
      description: task.name,
      content: task.note,
    };
    await this.client.updateTask(todoistTask.id, updateData);
    return todoistTask.id;
  }

  async syncTask(task: TaskDTO): Promise<TaskDTO> {
    if (!task.todoistTaskId) {
      return;
    }
    const todoistTask: Task = await this.client.getTask(task.todoistTaskId);
    if (!todoistTask) {
      throw new Error(
        throw new Error(
          `Task could not be found with id ${task.todoistTaskId}. 
          Board: ${task.board.id}. Task: ${task.id}`
        )
      )
    }
    task.name = todoistTask.description;
    task.note = todoistTask.content;
    task.order = todoistTask.order;
    return task;
  }

  async removeTask(id: string): Promise<void> {
    await this.client.deleteTask(id);
  }
}
