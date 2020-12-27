import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';

@Controller('hello-world')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Say hello world' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
