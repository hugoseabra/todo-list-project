import {createMock} from "@golevelup/ts-jest";
import {Test, TestingModule} from '@nestjs/testing';

import {BoardController} from './board.controller';
import {BoardService} from "@apps/todo/service";


describe('TodoistService', () => {
  let controller: BoardController;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BoardService,
          useValue: createMock<BoardService>(),
        },
      ],
      controllers: [BoardController],
    }).compile();

    controller = module.get<BoardController>(BoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
