import {HttpException, HttpStatus, Injectable} from '@nestjs/common';

import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

import {TaskEntity} from '@apps/todo/entity/task.entity';
import {BoardService} from "@apps/todo/service/board.service";
import {BoardEntity} from "@apps/todo/entity";
import {CreateTaskDTO, TaskDTO} from '../dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly boardService: BoardService,
  ) {
  }

  async getAll(boardId: string): Promise<TaskDTO[]> {
    await this.boardService.checkBoard(boardId);
    const instances = await this.taskRepository.find({
      where: {board: {id: boardId}}
    });
    return instances.map(b => b.export());
  }

  async get(boardId: string, id: string): Promise<TaskDTO> {
    await this.boardService.checkBoard(boardId);
    const instance = await this.retrieveEntity(id, true);
    return instance.export();
  }

  async retrieveEntity(id: string, includeBoard: boolean = false): Promise<TaskEntity> {
    const where = {where: {id}}
    if (includeBoard) {
      where["relations"] = ['board']
    }
    const instance = await this.taskRepository.findOne(where);

    if (!instance) {
      throw new HttpException(
        `Task not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return instance;
  }

  async create(boardId: string, data: CreateTaskDTO): Promise<TaskDTO> {
    const board = await this.getBoard(boardId);
    const {name} = data;
    const instance: TaskEntity = await this.taskRepository.create({name, board});
    await this.taskRepository.save(instance);

    await this.updateOrders(boardId);

    return instance.export();
  }

  async update(boardId: string, id: string, data: TaskDTO): Promise<TaskDTO> {
    await this.boardService.checkBoard(boardId);

    let instance = await this.retrieveEntity(id);
    await this.taskRepository.update({id}, data); // update

    instance = await this.retrieveEntity(id);

    return instance.export();
  }

  async destroy(boardId: string, id: string): Promise<void> {
    await this.boardService.checkBoard(boardId);
    const instance = await this.retrieveEntity(id);

    if (!instance) {
      throw new HttpException(
        `Task not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.taskRepository.delete({id});
  }

  async setOrder(boardId: string, id: string, toOrder: number): Promise<void> {
    await this.checkTask(boardId, id);
    const instance = await this.retrieveEntity(boardId, id);
    await this._updateOrder(instance, toOrder);
  }

  protected async _updateOrder(instance: TaskEntity, toOrder: number): Promise<void> {
    if (instance.order == toOrder) {
      // nothing to order
      return
    }

    const isFirst: boolean = instance.order == 0;
    const ignoreOrderUp = isFirst && orderDir == "up";
    if (ignoreOrderUp) {
      // There is no way to move up.
      return
    }

    const orderDir = instance.order < toOrder ? "down" : "up";
    const total = await this.count(instance.board.id, instance.id)

    const isLast: boolean = toOrder >= total;
    const ignoreOrderDown = isLast && orderDir == "down";
    if (ignoreOrderDown) {
      // There is no way to move down.
      return
    }

    const taskToReplace = await this.getByOrder(instance.board.id, toOrder);
    if (!taskToReplace) {
      // Order makes no sense to move
      return
    }

    taskToReplace.order = instance.order;
    instance.order = toOrder;
    await Promise.all([
      this.taskRepository.save(instance),
      this.taskRepository.save(taskToReplace),
    ]);
  }

  async updateOrders(boardId: string): Promise<void> {
    const instances = await this.getAll(boardId);
    let counter = 0;
    const updateRequests = [];
    instances.forEach(i => {
      updateRequests.push(
        this.taskRepository.update({id: i.id}, {order: counter})
      );
      counter++;
    });
    await Promise.all(updateRequests);
  }

  async getBoard(boardId: string): Promise<BoardEntity> {
    return this.boardService.retrieveEntity(boardId);
  }

  async getByOrder(boardId: string, order: number): Promise<TaskEntity | undefined> {
    return this.taskRepository.findOne({
      where: {
        order,
        board: {id: borderId},
      }
    })
  }

  async exists(borderId: string, id: string): Promise<boolean> {
    return this.taskRepository.exist({
      where: {
        id,
        board: {id: borderId},
      }
    })
  }

  async count(borderId: string, id: string): Promise<number> {
    return this.taskRepository.count({
      where: {
        id,
        board: {id: borderId},
      }
    })
  }

  async checkTask(boardId: string, id: string): Promise<void> {
    if (!await this.exists(boardId, id)) {
      throw new HttpException(
        `Task not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
