import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { ReservationStatus } from '../../reservations/reservation.entity';

export function IsAfter(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) return true;
          return new Date(value) > new Date(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} doit être après ${relatedPropertyName}.`;
        },
      },
    });
  };
}

export class CreateReservationDto {
  @IsInt()
  @IsPositive()
  carId!: number;

  @IsNotEmpty()
  @IsString()
  carBrand!: string;

  @IsNotEmpty()
  @IsString()
  carModel!: string;

  @IsNotEmpty()
  @IsString()
  clientName!: string;

  @IsNotEmpty()
  @IsString()
  clientEmail!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  @IsAfter('startDate', {
    message: 'La date de retour doit être après la date de départ.',
  })
  endDate!: string;

  @IsInt()
  @IsPositive()
  totalPrice!: number;

  @IsEnum(['en_cours', 'terminée', 'annulée', 'confirmée'])
  status!: ReservationStatus;

  @IsNotEmpty()
  @IsString()
  pickupLocation!: string;
}
