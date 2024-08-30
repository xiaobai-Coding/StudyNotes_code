import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { DddService } from './ddd/ddd.service';
import { CccService } from './ccc.service';

@Injectable()
export class AppService {
  constructor(@Inject(forwardRef(()=>CccService)) private  CccService: CccService, @Inject(forwardRef(()=>DddService)) private DddService: DddService){}
  getHello(): string {
    return this.DddService.ddd() + this.CccService.ccc()
  }
}
