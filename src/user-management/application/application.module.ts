import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from './use-cases/get-user-by-email.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { ManageUserAddressesUseCase } from './use-cases/manage-user-addresses.use-case';
import { UserApplicationService } from './services/user-application.service';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    // Use Cases
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    DeleteUserUseCase,
    ManageUserAddressesUseCase,

    // Application Services
    UserApplicationService,
  ],
  exports: [
    // Use Cases
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    DeleteUserUseCase,
    ManageUserAddressesUseCase,

    // Application Services
    UserApplicationService,
  ],
})
export class ApplicationModule {}
