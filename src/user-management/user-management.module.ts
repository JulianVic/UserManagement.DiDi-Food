import { Module } from '@nestjs/common';
import { UserController } from './infraestructure/controllers/user.controller';
import { UserApplicationService } from './application/services/user-application.service';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ManageUserAddressesUseCase } from './application/use-cases/manage-user-addresses.use-case';
import { PrismaUserRepository } from './infraestructure/repositories/prisma-user.repository';
import { PrismaService } from './infraestructure/database/prisma.service';
import { USER_REPOSITORY_TOKEN } from './domain/ports/user.repository.interface';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
    UserApplicationService,
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    GetAllUsersUseCase,
    DeleteUserUseCase,
    ManageUserAddressesUseCase,
  ],
  exports: [UserApplicationService, PrismaService],
})
export class UserManagementModule {} 