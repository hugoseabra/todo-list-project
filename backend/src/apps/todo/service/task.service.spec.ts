import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";

import {TaskEntity} from "@todo/entity/task.entity";
import {TaskService} from './task.service';

const tasks = [
  {
    name: 'Task #1',
    board: {
      name: 'Board #1',
      description: 'desc #1',
    }
  },
  {
    name: 'Task #2',
    board: {
      name: 'Board #1',
      description: 'desc #1',
    }
  },
];

const task1 = tasks[0];

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(tasks),
            findOneBy: jest.fn().mockResolvedValue(task1),
            save: jest.fn().mockResolvedValue(task1),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
