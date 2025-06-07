import {
  User as PrismaUser,
  Address as PrismaAddress,
  Role as PrismaRole,
} from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { DeliveryUser } from '../../domain/entities/delivery.entity';
import { Restaurant } from '../../domain/entities/restaurante.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { ContactInfo } from '../../domain/value-objects/contact-info.value-object';
import { Credentials } from '../../domain/value-objects/credentials.value-object';
import { Address } from '../../domain/value-objects/adress.value-object';

type PrismaUserWithAddresses = PrismaUser & { addresses: PrismaAddress[] };

export class PrismaUserMapper {
  static toDomain(prismaUser: PrismaUserWithAddresses): User {
    const contactInfo = new ContactInfo(prismaUser.email, prismaUser.phone);
    const credentials = Credentials.fromPersisted(
      prismaUser.username,
      prismaUser.hashedPassword,
    );

    const addresses = prismaUser.addresses.map(
      (addr) =>
        new Address(
          addr.street,
          addr.number,
          addr.neighborhood,
          addr.city,
          addr.state,
          addr.zipCode,
          addr.country,
          addr.additionalInfo || undefined,
        ),
    );

    let user: User;

    switch (prismaUser.role) {
      case PrismaRole.CUSTOMER:
        user = Customer.create(
          prismaUser.id,
          prismaUser.name,
          prismaUser.lastName || '',
          contactInfo,
          credentials,
        );
        break;
      case PrismaRole.DELIVERY_PERSON:
        user = DeliveryUser.create(
          prismaUser.id,
          prismaUser.name,
          prismaUser.lastName || '',
          contactInfo,
          credentials,
        );
        if (prismaUser.profilePictureUrl && prismaUser.vehicleType) {
          (user as DeliveryUser).completeProfile(
            prismaUser.profilePictureUrl,
            prismaUser.vehicleType as 'moto' | 'carro' | 'bicicleta',
          );
        }
        break;
      case PrismaRole.RESTAURANT_USER:
        user = Restaurant.create(
          prismaUser.id,
          prismaUser.name,
          contactInfo,
          credentials,
        );
        break;
      default:
        throw new Error('Rol de usuario desconocido desde la base de datos');
    }

    addresses.forEach((address) => user.addAddress(address));
    if (!prismaUser.isActive) {
      user.deleteUser();
    }

    return user;
  }

  static toPersistence(user: User) {
    const userData = user.toJSON();
    const role = this.mapDomainRoleToPrismaRole(user.getRole());
    const deliveryData =
      user instanceof DeliveryUser
        ? {
            profilePictureUrl: user.profilePictureUrl,
            vehicleType: user.vehicleType,
          }
        : {};

    return {
      id: userData.id,
      name: userData.name,
      lastName: userData.lastName,
      username: userData.credentials.username,
      email: userData.contact.email,
      phone: userData.contact.phone,
      hashedPassword: userData.credentials.hashedPassword,
      role: role,
      isActive: user.getIsActive(),
      ...deliveryData,
    };
  }

  private static mapDomainRoleToPrismaRole(role: UserRole): PrismaRole {
    switch (role) {
      case UserRole.CUSTOMER:
        return PrismaRole.CUSTOMER;
      case UserRole.DELIVERY_PERSON:
        return PrismaRole.DELIVERY_PERSON;
      case UserRole.RESTAURANT_USER:
        return PrismaRole.RESTAURANT_USER;
      default:
        throw new Error(`Rol de dominio no mapeado: ${String(role)}`);
    }
  }
}
