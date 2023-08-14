import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {ApiResponse, ApiTags} from "@nestjs/swagger";

import {CreateTaskDTO, TaskDTO} from "@apps/todo/dto";
import {TaskService} from '../service';

@ApiTags('Tasks')
@Controller('todo/:boardId/tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
  ) {
  }

  @Get()
  @ApiResponse({status: 200, description: 'Tasks list'})
  async findAll(@Param('boardId') boardId: string, @Req() req: any): Promise<TaskDTO[]> {
    return await this.taskService.getAll(boardId);
  }

  @Get(':id')
  @ApiResponse({status: 200, description: 'Tasks item found'})
  @ApiResponse({status: 400, description: 'Bad request'})
  @ApiResponse({status: 404, description: 'Task not found'})
  async findOne(
    @Param('boardId') boardId: string,
    @Param('id') id: string
  ): Promise<TaskDTO> {
    return this.taskService.get(boardId, id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiResponse({status: 201, description: 'Task created successfully'})
  async create(
    @Param('boardId') boardId: string,
    @Body() data: CreateTaskDTO,
    @Req() req: any,
  ): Promise<TaskDTO> {
    return this.taskService.create(boardId, data);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({status: 200, description: 'Task updated successfully'})
  @ApiResponse({status: 404, description: 'Task not found'})
  async update(
    @Param('boardId') boardId: string,
    @Param('id') id: string,
    @Body() data: TaskDTO,
  ): Promise<TaskDTO> {
    return await this.taskService.update(boardId, id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({status: 201, description: '®   deleted successfully'})
  @ApiResponse({status: 404, description: 'Task not found'})
  async destroy(
    @Param('boardId') boardId: string,
    @Param('id') id: string
  ): Promise<void> {
    await this.taskService.destroy(boardId, id);
  }
}
