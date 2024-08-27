import { Inject, Injectable } from '@nestjs/common';
import { OtherService } from './other/other.service';

@Injectable()
export class AppService {
  @Inject(OtherService)
  private OtherService: OtherService
  getHello(): string {
    return 'Hello World! NestJS' + this.OtherService.xxx();
  }
}
