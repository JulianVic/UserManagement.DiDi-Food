import { User } from './user.entity';
import { Address } from '../value-objects/address.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export class Customer extends User {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
    addresses: Address[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    isActive: boolean = true,
    isVerified: boolean = false,
    private preferredPaymentMethod?: string,
    private loyaltyPoints: number = 0,
  ) {
    super(
      id,
      firstName,
      lastName,
      contactInfo,
      credentials,
      UserRole.CUSTOMER,
      addresses,
      createdAt,
      updatedAt,
      isActive,
      isVerified,
    );
  }

  static create(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
  ): Customer {
    return new Customer(id, firstName, lastName, contactInfo, credentials);
  }

  // Métodos específicos del cliente
  addLoyaltyPoints(points: number): void {
    if (points < 0) {
      throw new Error('Los puntos de lealtad no pueden ser negativos');
    }
    this.loyaltyPoints += points;
    this.updateTimestamp();
  }

  redeemLoyaltyPoints(points: number): void {
    if (points < 0) {
      throw new Error('Los puntos a redimir no pueden ser negativos');
    }
    if (points > this.loyaltyPoints) {
      throw new Error('No tienes suficientes puntos de lealtad');
    }
    this.loyaltyPoints -= points;
    this.updateTimestamp();
  }

  setPreferredPaymentMethod(paymentMethod: string): void {
    if (!paymentMethod?.trim()) {
      throw new Error('El método de pago preferido no puede estar vacío');
    }
    this.preferredPaymentMethod = paymentMethod;
    this.updateTimestamp();
  }

  getPrimaryAddress(): Address | null {
    return this.addresses.length > 0 ? this.addresses[0] : null;
  }

  // Getters específicos
  getLoyaltyPoints(): number {
    return this.loyaltyPoints;
  }

  getPreferredPaymentMethod(): string | undefined {
    return this.preferredPaymentMethod;
  }

  private updateTimestamp(): void {
    (this as any).updatedAt = new Date();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      preferredPaymentMethod: this.preferredPaymentMethod,
      loyaltyPoints: this.loyaltyPoints,
      primaryAddress: this.getPrimaryAddress()?.toJSON() || null,
    };
  }
} 