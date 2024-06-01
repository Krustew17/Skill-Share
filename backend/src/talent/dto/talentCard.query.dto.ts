import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class TalentCardsQueryDto {
  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
