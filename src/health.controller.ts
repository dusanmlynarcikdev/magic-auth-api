import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('health')
export default class HealthController {
  @Get()
  @HttpCode(HttpStatus.NO_CONTENT)
  check(): void {}
}
