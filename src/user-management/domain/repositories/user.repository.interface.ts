import { User } from '../entities/user.entity';

export interface UsuarioRepositoryInterface {
  // Operaciones básicas
  save<T extends User>(user: T): Promise<T>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}
