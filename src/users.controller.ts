import { Controller, Post, Body, BadRequestException, Get } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  private users: any[] = []; // Simulando una base de datos

  @Post()
  async createUser(@Body() userData: any) {
    console.log('📥 Datos recibidos:', userData);

    // Convertir el objeto plano a una instancia de la clase DTO
    const userDto = plainToClass(CreateUserDto, userData);
    console.log('🔄 DTO creado:', userDto);

    // Validar usando class-validator
    const errors = await validate(userDto);

    if (errors.length > 0) {
      console.log('❌ Errores de validación:', errors);
      
      // Formatear errores para respuesta más legible
      const formattedErrors = errors.map(error => ({
        campo: error.property,
        valor: error.value,
        errores: Object.values(error.constraints || {}),
      }));

      throw new BadRequestException({
        mensaje: 'Datos de entrada inválidos',
        errores: formattedErrors,
      });
    }

    console.log('✅ Validación exitosa');

    // Simular guardado en base de datos
    const newUser = {
      id: this.users.length + 1,
      ...userDto,
      createdAt: new Date(),
    };

    this.users.push(newUser);

    return {
      mensaje: 'Usuario creado exitosamente',
      usuario: newUser,
    };
  }

  @Get()
  getUsers() {
    return {
      mensaje: 'Lista de usuarios',
      usuarios: this.users,
      total: this.users.length,
    };
  }
} 