import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { addresses: true },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { addresses: true },
      orderBy: { name: 'asc' },
    });
    return users.map(user => PrismaUserMapper.toDomain(user));
  }

  async save(user: User): Promise<User> {
    const persistenceData = PrismaUserMapper.toPersistence(user);
    const userAddresses = user.getAddresses().map((addr) => addr.toJSON());

    const savedPrismaUser = await this.prisma.user.upsert({
      where: { id: persistenceData.id },
      update: {
        ...persistenceData,
        addresses: {
          deleteMany: {},
          create: userAddresses.map((addr) => ({
            street: addr.street,
            number: addr.number,
            neighborhood: addr.neighborhood,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country,
            additionalInfo: addr.additionalInfo,
          })),
        },
      },
      create: {
        ...persistenceData,
        addresses: {
          create: userAddresses.map((addr) => ({
            street: addr.street,
            number: addr.number,
            neighborhood: addr.neighborhood,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country,
            additionalInfo: addr.additionalInfo,
          })),
        },
      },
      include: {
        addresses: true,
      },
    });

    return PrismaUserMapper.toDomain(savedPrismaUser);
  }
}
