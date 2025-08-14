import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../dtos/api-response.dto';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  message: string,
  statusCode: number,
  model?: TModel,
) => {
  return applyDecorators(
    model ? ApiExtraModels(ApiResponseDto, model) : ApiExtraModels(ApiResponseDto),
    ApiResponse({
      status: statusCode,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              success: { example: true },
              message: { example: message },
              error: { example: null },
              statusCode: { example: statusCode },
              data: model ? { $ref: getSchemaPath(model) } : { type: 'null', example: null },
            },
          },
        ],
      },
    }),
  );
};

export const ApiErrorResponse = (
  message: string[] | string,
  statusCode: number,
  error: string,
) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              success: { example: false },
              message: { example: message },
              error: { example: error },
              statusCode: { example: statusCode },
              data: { type: 'null', example: null },
            },
          },
        ],
      },
    }),
  );
};