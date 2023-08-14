import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from '@nestjs/common';

import {BoardEntity, TaskEntity} from "@apps/todo/entity";
import {BoardService, TaskService} from "@apps/todo/service";
import {BoardController, TaskController} from "@apps/todo/api";

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardEntity, TaskEntity]),
  ],
  providers: [BoardService, TaskService],
  controllers: [BoardController, TaskController],
})
export class TodoModule {
}
