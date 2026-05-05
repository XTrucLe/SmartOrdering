import { plainToInstance } from 'class-transformer';
import { ZoneResponseDto } from './dtos/zone.dto';
import { Zone } from './zone.entity';

export class ZoneMapper {
  static toDto(zone: Zone): ZoneResponseDto {
    return plainToInstance(ZoneResponseDto, zone, { excludeExtraneousValues: true });
  }

  static toDtos(zones: Zone[]): ZoneResponseDto[] {
    return zones.map((zone) => this.toDto(zone));
  }
}
