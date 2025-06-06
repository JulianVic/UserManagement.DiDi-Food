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
  ) {
    this.validateUser();
  }

  get entityId(): string {
    return this.id;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get userRole(): UserRole {
    return this.role;
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

  addAddress(address: Address): void {
    this.addresses.push(address);
  }

  removeAddress(addressIndex: number): void {
    this.addresses.splice(addressIndex, 1);
  }

  updateAddress(addressIndex: number, newAddress: Address): void {
    this.addresses[addressIndex] = newAddress;
  }

  async authenticateWithPassword(plainPassword: string): Promise<boolean> {
    return this.credentials.verifyPassword(plainPassword);
  }

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
    };
  }
}
