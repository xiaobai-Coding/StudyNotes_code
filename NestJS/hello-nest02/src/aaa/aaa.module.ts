import { Module } from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaController } from './aaa.controller';

@Module({
  providers: [AaaService],
  controllers: [AaaController]
})
export class AaaModule {}
