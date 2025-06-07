import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../../domain/ports/user.repository.interface';
import {
  UserResponseDto,
  ContactInfoResponseDto,
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
    return users.map(user => this.mapToResponseDto(user));
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
      [], // Las direcciones se pueden mapear si están disponibles
      user.getIsActive(),
    );
  }
} 