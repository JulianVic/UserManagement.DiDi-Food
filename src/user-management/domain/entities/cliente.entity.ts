import { User } from './user.entity';
import { Address } from '../value-objects/address.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export class Cliente extends User {
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
  ): Cliente {
    return new Cliente(id, firstName, lastName, contactInfo, credentials);
  }

  // Comportamientos ricos del Cliente
  earnLoyaltyPoints(points: number): void {
    this.ensureCanEarnPoints();
    this.validatePositivePoints(points);

    this.loyaltyPoints += points;
    this.updateTimestamp();
  }

  redeemLoyaltyPoints(points: number): void {
    this.ensureCanRedeemPoints();
    this.validatePositivePoints(points);
    this.ensureHasEnoughPoints(points);

    this.loyaltyPoints -= points;
    this.updateTimestamp();
  }

  configurePreferredPaymentMethod(paymentMethod: string): void {
    this.ensureCanConfigurePayment();
    this.validatePaymentMethod(paymentMethod);

    this.preferredPaymentMethod = paymentMethod;
    this.updateTimestamp();
  }

  // Consultas de negocio específicas del Cliente
  canAffordWithPoints(requiredPoints: number): boolean {
    return this.loyaltyPoints >= requiredPoints;
  }

  isEligibleForPremiumFeatures(): boolean {
    return this.loyaltyPoints >= 1000 && this.isVerified;
  }

  hasConfiguredPayment(): boolean {
    return !!this.preferredPaymentMethod;
  }

  get primaryDeliveryAddress(): Address | null {
    return this.addresses.length > 0 ? this.addresses[0] : null;
  }

  get currentLoyaltyPoints(): number {
    return this.loyaltyPoints;
  }

  private ensureCanEarnPoints(): void {
    if (!this.canPerformActions()) {
      throw new Error(
        'No puedes ganar puntos con una cuenta inactiva o no verificada',
      );
    }
  }

  private ensureCanRedeemPoints(): void {
    if (!this.canPerformActions()) {
      throw new Error(
        'No puedes redimir puntos con una cuenta inactiva o no verificada',
      );
    }
  }

  private ensureCanConfigurePayment(): void {
    if (!this.canPerformActions()) {
      throw new Error('No puedes configurar pagos con una cuenta inactiva');
    }
  }

  private validatePositivePoints(points: number): void {
    if (points < 0) {
      throw new Error('Los puntos no pueden ser negativos');
    }
    if (points === 0) {
      throw new Error('Los puntos deben ser mayores a cero');
    }
  }

  private ensureHasEnoughPoints(points: number): void {
    if (points > this.loyaltyPoints) {
      throw new Error(
        `No tienes suficientes puntos. Tienes: ${this.loyaltyPoints}, necesitas: ${points}`,
      );
    }
  }

  private validatePaymentMethod(paymentMethod: string): void {
    if (!paymentMethod?.trim()) {
      throw new Error('El método de pago preferido no puede estar vacío');
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      preferredPaymentMethod: this.preferredPaymentMethod,
      loyaltyPoints: this.loyaltyPoints,
      primaryAddress: this.primaryDeliveryAddress?.toJSON() || null,
      isEligibleForPremium: this.isEligibleForPremiumFeatures(),
      hasConfiguredPayment: this.hasConfiguredPayment(),
    };
  }
}
