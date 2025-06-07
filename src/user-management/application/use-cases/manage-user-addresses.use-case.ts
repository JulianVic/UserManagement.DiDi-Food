import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository.interface';
import { AddressDto } from '../dtos/create-user.dto';
import {
  UserResponseDto,
  ContactInfoResponseDto,
} from '../dtos/user-response.dto';
import { Address } from '../../domain/value-objects/adress.value-object';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class ManageUserAddressesUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async addAddress(
    userId: string,
    addressDto: AddressDto,
  ): Promise<UserResponseDto> {
    if (!userId?.trim()) {
      throw new Error('El ID del usuario es requerido');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const address = new Address(
      addressDto.street,
      addressDto.number,
      addressDto.neighborhood,
      addressDto.city,
      addressDto.state,
      addressDto.zipCode,
      addressDto.country,
      addressDto.additionalInfo,
    );

    try {
      user.addAddress(address);
      const updatedUser = await this.userRepository.save(user);
      return this.mapToResponseDto(updatedUser);
    } catch (error) {
      throw new Error(`Error al agregar dirección: ${error}`);
    }
  }

  async removeAddress(
    userId: string,
    addressDto: AddressDto,
  ): Promise<UserResponseDto> {
    if (!userId?.trim()) {
      throw new Error('El ID del usuario es requerido');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const address = new Address(
      addressDto.street,
      addressDto.number,
      addressDto.neighborhood,
      addressDto.city,
      addressDto.state,
      addressDto.zipCode,
      addressDto.country,
      addressDto.additionalInfo,
    );

    user.removeAddress(address);
    const updatedUser = await this.userRepository.save(user);

    return this.mapToResponseDto(updatedUser);
  }

  private mapToResponseDto(user: User): UserResponseDto {
    const userData = user.toJSON();

    return new UserResponseDto(
      userData.id,
      userData.name,
      userData.lastName,
      user.getFullName(),
      new ContactInfoResponseDto(
        userData.contact.email,
        userData.contact.phone,
      ),
      user.getRole(),
      [], // Las direcciones se mapearían aquí si estuvieran disponibles en toJSON()
      true,
    );
  }
}
