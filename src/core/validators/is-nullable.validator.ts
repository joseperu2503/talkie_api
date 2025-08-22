import { applyDecorators } from '@nestjs/common';
import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsNullable() {
  return applyDecorators(ValidateIf((obj, value) => value != null));
}

export function IsNullableIf(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return applyDecorators(
    ValidateIf(
      (obj, value) => !condition(obj, value) || value != null,
      validationOptions,
    ),
  );
}
