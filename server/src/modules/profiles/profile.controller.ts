import { Body, Controller, Param, Get, UseGuards, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { mapToProfileDto } from './profile.mapper';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../accounts/constants/role.constant';
import { JwtPayload } from '../auth/dtos/auth.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
