import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { JwtGuard } from '@/modules/identity/guards/jwt.guard';
import { StoreInfo } from '@/modules/stores/dtos/stores/store-info.dto';
import { StoreRoleGuard } from '@/modules/stores/guards/store-role.guard';
import { StoreOwner } from '@/modules/stores/decorators/store-role-group.decorator';
import { CreateTagDto } from '../dtos/tag.dto';
import { CurrentStore } from '@/modules/stores/decorators/current-store.decorator';

@Controller('tags')
@UseGuards(JwtGuard, StoreRoleGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @StoreOwner()
  async createTag(@CurrentStore() store: StoreInfo, @Body() dto: CreateTagDto) {
    return this.tagService.createTag(store.id, dto);
  }

  @Get()
  async getAllTags() {
    return this.tagService.getTags();
  }
}
