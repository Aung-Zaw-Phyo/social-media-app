import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

interface ResponseData {
  success: boolean;
  message: string;
  error: string | null;
  statusCode: number;
  data: any;
}

class SerializeInterceptor implements NestInterceptor {
    constructor(
        private dto?: ClassConstructor<any>,
        private message?: string,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: any): ResponseData => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;
                const formatedData = this.dto ? plainToClass(this.dto, data, {excludeExtraneousValues: true}) : data;
                return {
                    success: statusCode >= 200 && statusCode < 300,
                    message: this.message || 'success',
                    error: null,
                    statusCode,
                    data: formatedData || null,
                }
            })
        )
    }
}

export function Serialize(options?: { dto?: ClassConstructor<any>, message?: string }) {
    return UseInterceptors(new SerializeInterceptor(options ? options.dto : undefined, options ? options.message : undefined));
}