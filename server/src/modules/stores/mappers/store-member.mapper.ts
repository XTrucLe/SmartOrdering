import { plainToInstance } from 'class-transformer';
import { StoreMember } from '../entities/store-member.entity';
import { StoreMemberResponseDto } from '../dtos/store-members/store-member.dto';

export function mapToStoreMemberDto(
  storeMember: StoreMember,
): StoreMemberResponseDto {
  return plainToInstance(StoreMemberResponseDto, storeMember, {
    excludeExtraneousValues: true,
  });
}

export function mapToStoreMemberDtos(
  storeMembers: StoreMember[],
): StoreMemberResponseDto[] {
  return storeMembers.map((member) =>
    plainToInstance(StoreMemberResponseDto, member, {
      excludeExtraneousValues: true,
    }),
  );
}
