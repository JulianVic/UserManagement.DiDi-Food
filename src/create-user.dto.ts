import { IsEmail, IsString, IsInt, Min, Max, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(18, { message: 'La edad mínima es 18 años' })
  @Max(120, { message: 'La edad máxima es 120 años' })
  age: number;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsOptional()
  phone?: string;
} 