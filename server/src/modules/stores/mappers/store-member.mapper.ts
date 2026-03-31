import { plainToInstance } from 'class-transformer';
import { StoreMember } from '../entities/store-member.entity';
import { StoreMemberResponseDto } from '../dtos/store-members/store-member.dto';

export function mapToStoreMemberDto(
  storeMember: StoreMember,
): StoreMemberResponseDto {
  return plainToInstance(
    StoreMemberResponseDto,
    {
      ...storeMember,
      email: storeMember.account.email,
      profile: storeMember.account.profile,
    },
    {
      excludeExtraneousValues: true,
    },
  );
}

export function mapToStoreMemberDtos(
  storeMembers: StoreMember[],
): StoreMemberResponseDto[] {
  return storeMembers.map((member) =>
    plainToInstance(
      StoreMemberResponseDto,
      {
        ...member,
        email: member.account.email,
        profile: member.account.profile,
      },
      {
        excludeExtraneousValues: true,
      },
    ),
  );
}
