import { User } from '../entities/user.entity';

export interface AuthRepositoryInterface {
  createToken(user: User): Promise<string>;
  verifyToken(token: string): Promise<User>;
}
