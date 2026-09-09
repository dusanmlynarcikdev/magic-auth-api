import { Injectable } from '@nestjs/common';

@Injectable()
export default class ClockProvider {
  now(): Date {
    return new Date();
  }
}
