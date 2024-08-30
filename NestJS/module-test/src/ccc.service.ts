import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { DddService } from './ddd/ddd.service';

@Injectable()
export class CccService {
  constructor(@Inject(forwardRef(()=>DddService)) private dddService: DddService){}
  ccc(){
    return this.dddService.ddd() + 'ddd'
  }
}
