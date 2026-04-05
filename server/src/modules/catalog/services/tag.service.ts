import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from '../dtos/tag.dto';
import { handleError } from '@/common/utils/handle-error';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(storeId: string, dto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create({ ...dto, storeId });
    try {
      return this.tagRepository.save(tag);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  async getTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async getTagByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { name } });
    if (!tag) {
      throw new NotFoundException(`Tag with name ${name} not found.`);
    }
    return tag;
  }

  async isTagUnique(storeId: string, name: string): Promise<boolean> {
    const tag = await this.tagRepository.find({
      where: { name, storeId: In([storeId, null]) },
    });
    return !tag;
  }

  async checkTagsExist(names: string[]): Promise<void> {
    if (names.length === 0) return;
    const existingTags = await this.tagRepository.find({
      where: { name: In(names) },
    });
    const existingTagNames = existingTags.map((tag) => tag.name);
    const missingTagNames = names.filter(
      (name) => !existingTagNames.includes(name),
    );
    if (missingTagNames.length > 0) {
      throw new NotFoundException(
        `Tag(s) with name(s) ${missingTagNames.join(', ')} not found.`,
      );
    }
  }
}
