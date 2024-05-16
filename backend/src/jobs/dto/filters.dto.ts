import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class filtersDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pay?: number;

  @IsString()
  @IsOptional()
  order?: string;
}
