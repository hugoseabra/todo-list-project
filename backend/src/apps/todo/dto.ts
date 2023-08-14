import {
  IsBoolean,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength
} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class TaskDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  done: boolean;

  @ApiProperty()
  @IsBoolean()
  favorite: boolean;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  note?: string;

  /**
   * Todoist task ID
   */
  @IsString()
  todoistTaskId?: string;

  @IsInstance(BoardDTO)
  board: BoardDTO;

  createdOn?: Date;
}

export class CreateTaskDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  note?: string;
}

export class BoardDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  /**
   * Todoist project ID
   */
  @IsString()
  todoistProjectId?: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  description?: string;

  createdOn?: Date;

  tasks?: TaskDTO[];
}

export class CreateBoardDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
