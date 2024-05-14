import { IsString, IsArray } from 'class-validator';

export class jobPostDto {
  title: string;
  description: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  pay: number;
  type: string;
  deadline: Date;
}
