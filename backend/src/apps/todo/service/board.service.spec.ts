import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";

import {BoardEntity} from "@apps/todo/entity";
import {BoardService} from './board.service';

const boards = [
  {
    name: 'Board #1',
    description: 'desc #1',
  },
  {
    name: 'Board #2',
    description: 'desc #2',
  },
];

const board1 = boards[0];

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(BoardEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(boards),
            findOneBy: jest.fn().mockResolvedValue(board1),
            save: jest.fn().mockResolvedValue(board1),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
