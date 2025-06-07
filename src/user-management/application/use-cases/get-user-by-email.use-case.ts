import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/ports/user.repository.interface';
import {
  UserResponseDto,
  ContactInfoResponseDto,
  AddressResponseDto,
} from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<UserResponseDto | null> {
    if (!email?.trim()) {
      throw new Error('El email es requerido');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del email no es válido');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.getIsActive()) {
      throw new Error('El usuario ha sido eliminado y no está disponible');
    }

    return this.mapToResponseDto(user);
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
      userData.addresses.map(addr => new AddressResponseDto(
        addr.street,
        addr.number,
        addr.city,
        addr.state,
        addr.zipCode,
        addr.additionalInfo
      )),
      user.getIsActive(),
    );
  }
}
