import { plainToInstance } from 'class-transformer';
import { Profile } from '../entities/profile.entity';
import { ProfileResponseDto } from '../dtos/profile.dto';

export function mapToProfileDto(profile: Profile): ProfileResponseDto {
  const profileDto = plainToInstance(
    ProfileResponseDto,
    {
      ...profile,
      email: profile.account?.email,
      phoneNumber: profile.account?.phoneNumber,
      globalRole: profile.account?.role,
    },
    {
      excludeExtraneousValues: true,
    },
  );
  return profileDto;
}
