import { Injectable, Inject } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../domain/ports/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import {
  UserResponseDto,
  ContactInfoResponseDto,
  AddressResponseDto,
} from '../dtos/user-response.dto';
import { ContactInfo } from '../../domain/value-objects/contact-info.value-object';
import { Credentials } from '../../domain/value-objects/credentials.value-object';
import { Address } from '../../domain/value-objects/adress.value-object';
import { Customer } from '../../domain/entities/customer.entity';
import { DeliveryUser } from '../../domain/entities/delivery.entity';
import { Restaurant } from '../../domain/entities/restaurante.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { User } from '../../domain/entities/user.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.contact.email,
    );

    // Solo validar duplicados si el usuario existente está activo
    if (existingUser && existingUser.getIsActive()) {
      throw new Error('El email ya está en uso por un usuario activo');
    }

    const contactInfo = new ContactInfo(
      createUserDto.contact.email,
      createUserDto.contact.phone,
    );

    const credentials = new Credentials(
      createUserDto.contact.email,
      createUserDto.password,
    );

    const addresses =
      createUserDto.addresses?.map(
        (addressDto) =>
          new Address(
            addressDto.street,
            addressDto.number,
            addressDto.neighborhood,
            addressDto.city,
            addressDto.state,
            addressDto.zipCode,
            addressDto.country,
            addressDto.additionalInfo,
          ),
      ) || [];

    const userId = randomUUID();
    let user: User;

    switch (createUserDto.role) {
      case UserRole.CUSTOMER:
        user = Customer.create(
          userId,
          createUserDto.name,
          createUserDto.lastName || '',
          contactInfo,
          credentials,
        );
        break;
      case UserRole.DELIVERY_PERSON:
        user = DeliveryUser.create(
          userId,
          createUserDto.name,
          createUserDto.lastName || '',
          contactInfo,
          credentials,
        );
        break;
      case UserRole.RESTAURANT_USER:
        user = Restaurant.create(
          userId,
          createUserDto.name,
          contactInfo,
          credentials,
        );
        break;
      default:
        throw new Error('Rol de usuario no válido');
    }

    addresses.forEach((address) => user.addAddress(address));

    const savedUser = await this.userRepository.save(user);

    return this.mapToResponseDto(savedUser);
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
      userData.addresses.map(
        (addr) =>
          new AddressResponseDto(
            addr.street,
            addr.number,
            addr.city,
            addr.state,
            addr.zipCode,
            addr.additionalInfo,
          ),
      ),
      user.getIsActive(),
    );
  }
}
