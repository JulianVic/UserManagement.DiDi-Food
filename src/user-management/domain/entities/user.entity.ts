import { Address } from '../value-objects/address.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export abstract class User {
  protected constructor(
    protected readonly id: string,
    protected readonly firstName: string,
    protected readonly lastName: string,
    protected readonly contactInfo: ContactInfo,
    protected readonly credentials: Credentials,
    protected readonly role: UserRole,
    protected addresses: Address[] = [],
    protected readonly createdAt: Date = new Date(),
    protected updatedAt: Date = new Date(),
    protected isActive: boolean = true,
    protected isVerified: boolean = false,
  ) {
    this.validateUser();
  }

  private validateUser(): void {
    if (!this.firstName?.trim()) {
      throw new Error('El nombre es requerido');
    }
    if (!this.lastName?.trim()) {
      throw new Error('El apellido es requerido');
    }
    if (!this.id?.trim()) {
      throw new Error('El ID del usuario es requerido');
    }
  }

  // Métodos de negocio
  addAddress(address: Address): void {
    if (this.addresses.length >= 5) {
      throw new Error('Un usuario no puede tener más de 5 direcciones');
    }

    const addressExists = this.addresses.some((existingAddress) =>
      existingAddress.equals(address),
    );

    if (addressExists) {
      throw new Error('Esta dirección ya existe para el usuario');
    }

    this.addresses.push(address);
    this.updateTimestamp();
  }

  removeAddress(addressIndex: number): void {
    if (addressIndex < 0 || addressIndex >= this.addresses.length) {
      throw new Error('Índice de dirección inválido');
    }

    this.addresses.splice(addressIndex, 1);
    this.updateTimestamp();
  }

  updateAddress(addressIndex: number, newAddress: Address): void {
    if (addressIndex < 0 || addressIndex >= this.addresses.length) {
      throw new Error('Índice de dirección inválido');
    }

    this.addresses[addressIndex] = newAddress;
    this.updateTimestamp();
  }

  verify(): void {
    if (this.isVerified) {
      throw new Error('El usuario ya está verificado');
    }
    this.isVerified = true;
    this.updateTimestamp();
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new Error('El usuario ya está desactivado');
    }
    this.isActive = false;
    this.updateTimestamp();
  }

  activate(): void {
    if (this.isActive) {
      throw new Error('El usuario ya está activo');
    }
    this.isActive = true;
    this.updateTimestamp();
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    return this.credentials.verifyPassword(plainPassword);
  }

  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  // Métodos para persistencia
  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: `${this.firstName} ${this.lastName}`,
      contactInfo: this.contactInfo.toJSON(),
      credentials: this.credentials.toJSON(),
      role: this.role,
      addresses: this.addresses.map((address) => address.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      isVerified: this.isVerified,
    };
  }
}
