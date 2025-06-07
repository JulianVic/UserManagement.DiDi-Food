import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<boolean> {
    if (!userId?.trim()) {
      throw new Error('El ID del usuario es requerido');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    user.deleteUser();

    await this.userRepository.save(user);

    return true;
  }
}
