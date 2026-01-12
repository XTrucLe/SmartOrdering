/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { StoresService } from '../stores.service';

@Injectable()
export class StoreGuard implements CanActivate {
  constructor(private readonly storeService: StoresService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const storeId: string = request.params.storeId;

    if (!storeId) {
      return false;
    }
    const store = await this.storeService.getStoreById(storeId);
    if (!store) {
      return false;
    }
    return true;
  }
}
