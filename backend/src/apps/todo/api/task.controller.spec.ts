import {createMock} from "@golevelup/ts-jest";
import {Test, TestingModule} from '@nestjs/testing';

import {TaskController} from './task.controller';
import {BoardService, TaskService} from "../service";


describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BoardService,
          useValue: createMock<BoardService>(),
        },
        {
          provide: TaskService,
          useValue: createMock<TaskService>(),
        },
      ],
      controllers: [TaskController],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
