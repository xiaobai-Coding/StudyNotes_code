import { createParamDecorator, SetMetadata, ExecutionContext } from '@nestjs/common';

export const Aaa = (...args: string[]) => SetMetadata('aaa', args);

export const MyHeaders = createParamDecorator((
  data: string, ctx: ExecutionContext
)=>{
  const request = ctx.switchToHttp().getRequest();
  return  data ? request.headers[data.toLowerCase()] : request.headers;
})

export const MyQuery = createParamDecorator((
  data: string, ctx: ExecutionContext
)=>{
  const request = ctx.switchToHttp().getRequest();
  return request.query[data]
})