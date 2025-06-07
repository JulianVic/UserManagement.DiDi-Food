import { Address } from '../value-objects/adress.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export abstract class User {
  protected constructor(
    protected readonly id: string,
    protected name: string,
    protected lastName: string | null,
    protected readonly contact: ContactInfo,
    protected readonly credentials: Credentials,
    protected readonly role: UserRole,
    protected addresses: Address[] = [],
    protected isActive: boolean = true,
  ) {
    this.validateUser();
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getFullName(): string {
    return this.lastName ? `${this.name} ${this.lastName}` : this.name;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getEmail(): string {
    return this.contact.getEmail();
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getAddresses(): Address[] {
    return this.addresses;
  }

  public addAddress(address: Address): void {
    if (this.addresses.length >= 5) {
      throw new Error('El usuario no puede tener más de 5 direcciones');
    }
    this.addresses.push(address);
  }

  public removeAddress(address: Address): boolean {
    const index = this.addresses.findIndex((a) => a.equals(address));
    if (index !== -1) {
      this.addresses.splice(index, 1);
      return true;
    }
    return false;
  }

  public deleteUser(): void {
    this.isActive = false;
  }

  // Validators
  private validateUser(): void {
    if (!this.id?.trim()) {
      throw new Error('El ID del usuario es requerido');
    }
    if (!this.name?.trim()) {
      throw new Error('El nombre es requerido');
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      fullName: this.getFullName(),
      contact: this.contact.toJSON(),
      credentials: this.credentials.toJSON(),
      role: this.role,
      addresses: this.addresses.map((addr) => addr.toJSON()),
      isActive: this.isActive,
    };
  }
}
