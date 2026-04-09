import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
