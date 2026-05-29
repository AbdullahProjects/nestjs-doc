import { Controller, Get, Param, DefaultValuePipe, ParseIntPipe, ParseBoolPipe, ParseFloatPipe, ParseUUIDPipe, ParseArrayPipe, ParseEnumPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findOne(@Param('value', new DefaultValuePipe(false), ParseBoolPipe) value: Boolean): string {
    return `The passed parameter is: ${value}`;
  }
}
