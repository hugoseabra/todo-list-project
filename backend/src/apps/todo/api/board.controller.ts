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

import {BoardDTO, CreateBoardDTO} from '../dto';
import {BoardService} from '../service';

@ApiTags('Boards')
@Controller('todo/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {
  }

  @Get()
  @ApiResponse({status: 200, description: 'Boards list'})
  async findAll(@Req() req: any): Promise<BoardDTO[]> {
    return await this.boardService.getAll();
  }

  @Get(':id')
  @ApiResponse({status: 200, description: 'Boards item found'})
  @ApiResponse({status: 400, description: 'Bad request'})
  @ApiResponse({status: 404, description: 'Board not found'})
  async findOne(@Param('id') id: string): Promise<BoardDTO> {
    return this.boardService.get(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiResponse({status: 201, description: 'Board created successfully'})
  async create(
    @Body() data: CreateBoardDTO,
    @Req() req: any,
  ): Promise<BoardDTO> {
    return this.boardService.create(data);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({status: 200, description: 'Board updated successfully'})
  @ApiResponse({status: 404, description: 'Board not found'})
  async update(
    @Param('id') id: string,
    @Body() data: BoardDTO,
  ): Promise<BoardDTO> {
    return await this.boardService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({status: 201, description: 'Board deleted successfully'})
  @ApiResponse({status: 404, description: 'Board not found'})
  async destroy(@Param('id') id: string): Promise<void> {
    await this.boardService.destroy(id);
  }
}
