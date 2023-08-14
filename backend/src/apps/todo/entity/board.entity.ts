import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import {TaskEntity} from "@apps/todo/entity";
import {BoardDTO} from "@apps/todo/dto";
import {TodoistProjectHookMixin} from "@integration/todoist";

@Entity('board')
export class BoardEntity extends TodoistProjectHookMixin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', nullable: false})
  name: string;

  @Column({type: 'text', nullable: true})
  description?: string;

  @Column({type: 'varchar', nullable: true})
  todoistProjectId: string;

  @CreateDateColumn()
  createdOn?: Date;

  @UpdateDateColumn()
  updatedOn?: Date;

  @OneToMany(type => TaskEntity, task => task.board)
  tasks?: TaskEntity[];

  public export = (): BoardDTO => {
    // Load tasks (lazy loaded)
    const tasks = this.tasks;

    const data = {
      id: this.id,
      name: this.name,
      description: this.description,
      createdOn: this.createdOn,
    }
    if (typeof tasks !== 'undefined') {
      data["tasks"] = tasks.length ? tasks.map((task: TaskEntity) => task.export()) : [];
    }
    return data;
  }
}
