import { Controller, Get, Header, SetMetadata, UseGuards, Headers, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AaaGuard } from './aaa.guard';
import { Aaa, MyHeaders, MyQuery } from './aaa.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Aaa('ccc')
  @UseGuards(AaaGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello2')
  getHello2(@Headers('Accept') Header1, @MyHeaders('Accept') Header2) {
    console.log("Header1", Header1)
    console.log("Header2", Header2)
  }

  @Get('hello3')
  getHello3(@Query('aaa') aaa, @MyQuery('bbb') bbb) {
    console.log("aaa", aaa)
    console.log("bbb", bbb)
  }
}
