import { IsArray, IsString } from 'class-validator';

export class updateTalentDto {
  title: string;
  description: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];
  pay: number;
}
