import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateSectionItemDto {
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;
}
