import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbSetupService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DbSetupService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`);
      this.logger.log('Unaccent extension enabled ✅');
    } catch (error) {
      this.logger.error('Failed to enable unaccent extension ❌', error);
    }
  }
}
