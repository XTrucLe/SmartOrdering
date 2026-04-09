import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  async create(
    profile: CreateProfileDto,
    account?: Account,
    manager?: EntityManager,
  ): Promise<Profile> {
    const repo = manager ? manager.getRepository(Profile) : this.profileRepository;

    const newProfile = repo.create(profile);

    if (account) {
      newProfile.account = account;
    }

    try {
      return await repo.save(newProfile);
    } catch (error) {
      throw new ConflictException('Failed to create profile');
    }
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getProfileByAccountId(accountId: string): Promise<Profile> {
    const existsProfile = await this.profileRepository.findOne({
      where: { account: { id: accountId } },
      relations: ['account'],
    });
    if (!existsProfile) {
      throw new NotFoundException('Profile not found');
    }
    return existsProfile;
  }

  async update(id: string, profile: UpdateProfileDto): Promise<Profile> {
    await this.profileRepository.update(id, profile);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.softDelete(id);
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find({
      where: { account: { isActive: true } },
    });
  }
}
