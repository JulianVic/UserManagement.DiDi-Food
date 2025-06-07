import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/ports/user.repository.interface';
import {
  UserResponseDto,
  ContactInfoResponseDto,
  AddressResponseDto,
} from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    const activeUsers = users.filter(user => user.getIsActive());
    return activeUsers.map(user => this.mapToResponseDto(user));
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