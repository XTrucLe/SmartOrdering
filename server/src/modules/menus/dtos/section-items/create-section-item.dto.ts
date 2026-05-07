import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSectionItemDto {
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}
