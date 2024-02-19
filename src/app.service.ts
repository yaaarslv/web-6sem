import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getViewName(pageName: string): string {
    return pageName;
  }
}
