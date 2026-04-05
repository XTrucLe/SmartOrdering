import { Body, Controller, Param, Get, UseGuards, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { mapToProfileDto } from '../mappers/profile.mapper';
import { Roles } from '../decorators/role.decorator';
import { JwtPayload } from '../dtos/auth.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ProfileService } from '../services/profile.service';
import { Role } from '../constants/role.constant';
import { UpdateProfileDto } from '../dtos/profile.dto';

@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() req: JwtPayload) {
    const accountId = req.sub;
    const profile = await this.profileService.getProfileByAccountId(accountId);
    return mapToProfileDto(profile);
  }

  @Get(':accountId')
  @Roles(Role.ADMIN)
  async findAll(@Param('accountId') accountId: string) {
    const profile = await this.profileService.findById(accountId);
    return mapToProfileDto(profile);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profileService.update(id, updateProfileDto);
    return mapToProfileDto(profile);
  }
}
