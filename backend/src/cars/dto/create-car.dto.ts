import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';
import { CarCategory, Transmission, Fuel } from '../car.entity';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  brand!: string;

  @IsNotEmpty()
  @IsString()
  model!: string;

  @IsInt()
  @Min(1900)
  year!: number;

  @IsInt()
  @IsPositive()
  price!: number;

  @IsIn(['economique', 'confort', 'luxe', 'suv'])
  category!: CarCategory;

  @IsInt()
  @Min(1)
  seats!: number;

  @IsIn(['automatique', 'manuelle'])
  transmission!: Transmission;

  @IsIn(['essence', 'diesel', 'électrique'])
  fuel!: Fuel;

  @IsBoolean()
  available!: boolean;

  @IsNotEmpty()
  @IsString()
  image!: string;

  @IsInt()
  @Min(0)
  rating!: number;

  @IsInt()
  @Min(0)
  reviews!: number;
}
