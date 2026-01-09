import { Module } from '@nestjs/common';
import { DbSetupService } from './services/db-setup.service';

@Module({
  providers: [DbSetupService],
  exports: [],
})
export class CommonModule {}
