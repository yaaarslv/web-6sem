import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {AppService} from "./app.service";

@Injectable()
export class TimingInterceptor implements NestInterceptor {
    constructor(private appService: AppService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => {
                    const requestTime = Date.now() - now;
                    this.appService.addRequestTime(requestTime);
                }),
            );
    }
}