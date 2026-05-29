import { Controller, Get, Param, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, ParseFloatPipe, ParseUUIDPipe, ParseArrayPipe, ParseEnumPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id/:name')
  findOne(@Param() params: object): string {
    return `The passed parameters are: ${params}`;
  }
}
