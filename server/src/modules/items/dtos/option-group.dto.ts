import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GroupType } from '../types/group-type.enum';
import { Exclude, Expose, Type } from 'class-transformer';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  extraPrice?: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;
}

export class CreateOptionGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(GroupType)
  groupType: GroupType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsNumber()
  @IsOptional()
  minSelection?: number;

  @IsNumber()
  @IsOptional()
  maxSelection?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class UpdateOptionDto extends PartialType(CreateOptionDto) {}

export class UpdateOptionGroupDto extends PartialType(CreateOptionGroupDto) {}

@Exclude()
export class OptionDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() extraPrice: number;
  @Expose() isDefault: boolean;
  @Expose() isAvailable: boolean;
  @Expose() displayOrder: number;
}

@Exclude()
export class OptionGroupDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() groupType: GroupType;
  @Expose() isActive: boolean;
  @Expose() displayOrder: number;
  @Expose() isRequired: boolean;
  @Expose() minSelection: number;
  @Expose() maxSelection: number;
  @Expose()
  @Type(() => OptionDto)
  options: OptionDto[];
}
