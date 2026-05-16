import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { StoreContextDto } from '../../store/dtos/store-context.dto';

export const CurrentStore = createParamDecorator(
  (data: keyof StoreContextDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const storeId: string | undefined = request.headers['x-store-id'];

    if (!storeId) {
      throw new BadRequestException('Missing header infomation, please check and try again');
    }

    const contextInfo = request.storeContext;

    if (!contextInfo) {
      return null;
    }

    return data ? contextInfo[data] : contextInfo;
  },
);
