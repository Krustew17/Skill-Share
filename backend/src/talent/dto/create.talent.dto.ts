import { IsArray, IsString } from 'class-validator';

export class createTalentDto {
  title: string;
  description: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];
  pay: number;
}
