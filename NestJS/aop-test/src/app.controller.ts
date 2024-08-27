import { Controller, Get, Query, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './time.interceptor';
import { ValidatePipe } from './validate.pipe';

@Controller()
@UseInterceptors(TimeInterceptor)
@UsePipes(ValidatePipe)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
     console.log('handler...');
    return this.appService.getHello();
  }
  @Get('aaa')
  // @UseGuards(LoginGuard)
  aaa(@Query('num', ValidatePipe) num: number) {
    return num + 1
  }

  @Get('bbb')
  bbb(): string {
    console.log('bbb!')
    return 'bbb!'
  }
}
