/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UserApplicationService } from '../../application/services/user-application.service';
import {
  CreateUserDto,
  AddressDto,
} from '../../application/dtos/create-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null; //quue es T? T es
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return {
        success: true,
        message: 'Usuario creado exitosamente',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al crear usuario', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Get('all')
  async getAllUsers(): Promise<ApiResponse<UserResponseDto[]>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const users = await this.userService.getAllUsers();
      return {
        success: true,
        message: `Se encontraron ${users.length} usuarios`,
        data: users as UserResponseDto[],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error al obtener usuarios', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      const user = await this.userService.getUserById(id);
      return {
        success: true,
        message: 'Usuario encontrado',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Usuario no encontrado', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Get()
  async getUserByEmail(
    @Query('email') email: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email es requerido como parámetro de consulta',
          data: null,
        };
      }

      const user = await this.userService.getUserByEmail(email);
      return {
        success: true,
        message: 'Usuario encontrado',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Usuario no encontrado', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<ApiResponse<null>> {
    try {
      await this.userService.deleteUser(id);
      return {
        success: true,
        message: 'Usuario eliminado exitosamente',
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar usuario', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Post(':id/addresses')
  @HttpCode(HttpStatus.CREATED)
  async addUserAddress(
    @Param('id') id: string,
    @Body() address: AddressDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      const user = await this.userService.addAddressToUser(id, address);
      return {
        success: true,
        message: 'Dirección agregada exitosamente',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al agregar dirección', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Delete(':id/addresses')
  async removeUserAddress(
    @Param('id') id: string,
    @Body() address: AddressDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      const user = await this.userService.removeAddressFromUser(id, address);
      return {
        success: true,
        message: 'Dirección eliminada exitosamente',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al eliminar dirección', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Get(':id/exists')
  async checkUserExists(
    @Param('id') id: string,
  ): Promise<ApiResponse<boolean>> {
    try {
      const exists = await this.userService.userExists(id);
      return {
        success: true,
        message: exists ? 'Usuario existe' : 'Usuario no existe',
        data: exists,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al verificar usuario', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }

  @Get('email/:email/exists')
  async checkEmailExists(
    @Param('email') email: string,
  ): Promise<ApiResponse<boolean>> {
    try {
      const exists = await this.userService.emailExists(email);
      return {
        success: true,
        message: exists ? 'Email existe' : 'Email no existe',
        data: exists,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al verificar email', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        data: null,
      };
    }
  }
}
