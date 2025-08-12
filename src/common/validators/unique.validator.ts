import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaClient } from "generated/prisma";

export interface ValidateData {model: string, field: string}

const prisma = new PrismaClient();

@ValidatorConstraint({name: 'IsUniqueConstraint', async: true})
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor() {}

    async validate(value: any, validationArguments: ValidationArguments): Promise<boolean> {
        const { model, field }: ValidateData = validationArguments.constraints[0];
        const data = await prisma[model].findFirst({
            where: {
                [field]: value,
            },
        });
        return !data; 
    }

    defaultMessage(validationArguments: ValidationArguments) {
        const { model, field }: ValidateData = validationArguments.constraints[0];
        return `${field} already exists in ${model}s`;
    }
}

export function IsUnique(options: ValidateData, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        })
    }
}