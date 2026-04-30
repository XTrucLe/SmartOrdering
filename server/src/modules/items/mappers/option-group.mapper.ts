import { plainToInstance } from 'class-transformer';
import { OptionGroup } from '../entities/option-group.entity';
import { OptionGroupDto } from '../dtos/option-group.dto';

export class OptionGroupMapper {
  static toDto(group: OptionGroup): OptionGroupDto {
    return plainToInstance(OptionGroupDto, group, { excludeExtraneousValues: true });
  }

  static toDtos(groups: OptionGroup[]): OptionGroupDto[] {
    return groups.map((group) => this.toDto(group));
  }
}
