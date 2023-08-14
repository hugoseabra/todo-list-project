import {HttpException, HttpStatus, Injectable} from '@nestjs/common';

import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

import {BoardEntity} from '@apps/todo/entity';
import {BoardDTO, CreateBoardDTO} from '../dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {
  }

  async getAll(): Promise<BoardDTO[]> {
    const boards = await this.boardRepository.find();
    return boards.map(b => b.export());
  }

  async get(id: string): Promise<BoardDTO> {
    const board = await this.retrieveEntity(id, true);
    return board.export();
  }

  async retrieveEntity(id: string, includeTasks: boolean = false): Promise<BoardEntity> {
    const where = {where: {id}}
    if (includeTasks) {
      where["relations"] = ['tasks']
    }
    const board = await this.boardRepository.findOne(where);

    if (!board) {
      throw new HttpException(
        `Board not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return board;
  }

  async create(createTodoDto: CreateBoardDTO): Promise<BoardDTO> {
    const {name, description} = createTodoDto;
    const board: BoardEntity = await this.boardRepository.create({
      name,
      description,
    });

    await this.boardRepository.save(board);

    return board.export();
  }

  async update(id: string, data: BoardDTO): Promise<BoardDTO> {
    let board = await this.retrieveEntity(id);
    await this.boardRepository.update({id}, data); // update

    board = await this.retrieveEntity(id);

    return board.export();
  }

  async destroy(id: string): Promise<void> {
    const board = await this.retrieveEntity(id);

    if (!board) {
      throw new HttpException(
        `Board not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (board.tasks && board.tasks.length > 0) {
      throw new HttpException(
        `Cannot delete this Board: it has existing tasks`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.boardRepository.delete({id});
  }

  async exists(id: string): Promise<boolean> {
    return this.boardRepository.exist({where: {id}})
  }

  async checkBoard(boardId: string): Promise<void> {
    if (!await this.exists(boardId)) {
      throw new HttpException(
        `Board not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
