import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.use-case';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { ManageUserAddressesUseCase } from '../use-cases/manage-user-addresses.use-case';
import { CreateUserDto, AddressDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UserApplicationService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly manageUserAddressesUseCase: ManageUserAddressesUseCase,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      return await this.createUserUseCase.execute(createUserDto);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error}`);
    }
  }

  async getUserById(userId: string): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByIdUseCase.execute(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByEmailUseCase.execute(email);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error}`);
    }
  }

  async deleteUser(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.deleteUserUseCase.execute(userId);
      return {
        success: result,
        message: 'Usuario desactivado exitosamente',
      };
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error}`);
    }
  }

  async addAddressToUser(
    userId: string,
    addressDto: AddressDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.manageUserAddressesUseCase.addAddress(
        userId,
        addressDto,
      );
    } catch (error) {
      throw new Error(`Error al agregar dirección: ${error}`);
    }
  }

  async removeAddressFromUser(
    userId: string,
    addressDto: AddressDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.manageUserAddressesUseCase.removeAddress(
        userId,
        addressDto,
      );
    } catch (error) {
      throw new Error(`Error al remover dirección: ${error}`);
    }
  }

  async userExists(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserByIdUseCase.execute(userId);
      return user !== null;
    } catch {
      return false;
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmailUseCase.execute(email);
      return user !== null;
    } catch {
      return false;
    }
  }
}
