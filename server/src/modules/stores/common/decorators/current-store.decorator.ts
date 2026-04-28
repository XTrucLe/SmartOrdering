import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { StoreContextDto } from '../../store/dtos/store-context.dto';

export const CurrentStore = createParamDecorator(
  (data: keyof StoreContextDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const contextInfo = request.storeContext;

    if (!contextInfo) {
      return null;
    }

    return data ? contextInfo[data] : contextInfo;
  },
);
