import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentStore = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentStore;
  },
);
