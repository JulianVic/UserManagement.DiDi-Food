import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../domain/enums/user-role.enum';

export class ContactInfoDto {
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  phone: string;
}

export class AddressDto {
  @IsString({ message: 'La calle debe ser un texto' })
  @IsNotEmpty({ message: 'La calle es requerida' })
  street: string;

  @IsString({ message: 'El número debe ser un texto' })
  @IsNotEmpty({ message: 'El número es requerido' })
  number: string;

  @IsString({ message: 'La colonia debe ser un texto' })
  @IsNotEmpty({ message: 'La colonia es requerida' })
  neighborhood: string;

  @IsString({ message: 'La ciudad debe ser un texto' })
  @IsNotEmpty({ message: 'La ciudad es requerida' })
  city: string;

  @IsString({ message: 'El estado debe ser un texto' })
  @IsNotEmpty({ message: 'El estado es requerido' })
  state: string;

  @IsString({ message: 'El código postal debe ser un texto' })
  @IsNotEmpty({ message: 'El código postal es requerido' })
  zipCode: string;

  @IsString({ message: 'El país debe ser un texto' })
  @IsNotEmpty({ message: 'El país es requerido' })
  country: string;

  @IsOptional()
  @IsString({ message: 'Las referencias deben ser un texto' })
  additionalInfo?: string;
}

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser un texto' })
  lastName?: string;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contact: ContactInfoDto;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsEnum(UserRole, { message: 'El rol de usuario debe ser válido' })
  role: UserRole;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}
