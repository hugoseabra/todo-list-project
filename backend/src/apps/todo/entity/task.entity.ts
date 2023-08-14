import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import {BoardEntity} from "@apps/todo/entity";
import {TaskDTO} from "@apps/todo/dto";

@Entity('task', {orderBy: {order: "ASC"}})
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', nullable: false})
  name: string;

  @Column({type: 'boolean'})
  @Index()
  done: boolean = false;

  @Column({type: 'boolean'})
  @Index()
  favorite: boolean = false;

  @Column({type: 'int'})
  order?: number;

  @Column({type: 'text'})
  note?: string;

  @Column({type: 'varchar', nullable: true})
  todoistTaskId: string;

  @CreateDateColumn()
  createdOn?: Date;

  @ManyToOne(type => BoardEntity, board => board.tasks)
  @JoinColumn()
  board: BoardEntity;

  export = (): TaskDTO => {
    return {
      id: this.id,
      name: this.name,
      note: this.note,
      done: this.done,
      favorite: this.favorite,
      order: this.order,
      board: this.board.export(),
      createdOn: this.createdOn,
    }
  }
}
