import { User } from '../entities/user.entity';

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
