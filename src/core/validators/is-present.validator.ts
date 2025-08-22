import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function IsPresent(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPresent',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return args.object.hasOwnProperty(propertyName); // 👈 la key debe existir
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be present in the request body`;
        },
      },
    });
  };
}
