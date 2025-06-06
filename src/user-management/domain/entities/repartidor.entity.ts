/* eslint-disable prettier/prettier */
import { User } from './user.entity';
import { Address } from '../value-objects/address.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export enum DeliveryPersonStatus {
  AVAILABLE = 'disponible',
  BUSY = 'ocupado',
  OFFLINE = 'desconectado',
}

export enum VehicleType {
  BICYCLE = 'bicicleta',
  MOTORCYCLE = 'motocicleta',
  CAR = 'automovil',
}

export class RepartidorUser extends User {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
    addresses: Address[] = [],
    private vehicleType?: VehicleType,
    private licenseNumber?: string,
    private rating: number = 0,
    private completedDeliveries: number = 0,
    private status: DeliveryPersonStatus = DeliveryPersonStatus.OFFLINE,
    private isDocumentationVerified: boolean = false,
  ) {
    super(
      id,
      firstName,
      lastName,
      contactInfo,
      credentials,
      UserRole.DELIVERY_PERSON,
      addresses,
    );
  }

  static create(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
  ): RepartidorUser {
    return new RepartidorUser(id, firstName, lastName, contactInfo, credentials);
  }

  registerVehicleInformation(vehicleType: VehicleType, licenseNumber: string): void {
    this.validateLicenseNumber(licenseNumber);
    
    this.vehicleType = vehicleType;
    this.licenseNumber = licenseNumber;
  }

  completeDeliveryWithRating(customerRating: number): void {
    this.ensureCanCompleteDelivery();
    this.validateRating(customerRating);
    
    this.completedDeliveries += 1;
    this.updateAverageRating(customerRating);
    this.changeStatusTo(DeliveryPersonStatus.AVAILABLE);
  }

  completeDocumentationVerification(): void {
    this.ensureCanVerifyDocumentation();
    this.isDocumentationVerified = true;
  }

  isCurrentlyDelivering(): boolean {
    return this.status === DeliveryPersonStatus.BUSY;
  }

  isOnline(): boolean {
    return this.status !== DeliveryPersonStatus.OFFLINE;
  }

  hasVehicleRegistered(): boolean {
    return !!this.vehicleType && !!this.licenseNumber;
  }

  get currentRating(): number {
    return this.rating;
  }

  get totalCompletedDeliveries(): number {
    return this.completedDeliveries;
  }

  get currentStatus(): DeliveryPersonStatus {
    return this.status;
  }

  private ensureCanCompleteDelivery(): void {
    if (!this.isCurrentlyDelivering()) {
      throw new Error('No puedes completar una entrega si no estás en estado ocupado');
    }
  }

  private ensureCanVerifyDocumentation(): void {
    if (!this.hasVehicleRegistered()) {
      throw new Error(
        'Debes registrar la información del vehículo antes de verificar documentación',
      );
    }
  }

  private validateLicenseNumber(licenseNumber: string): void {
    if (!licenseNumber?.trim()) {
      throw new Error('El número de licencia es requerido');
    }
  }

  private validateRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }
  }

  private changeStatusTo(newStatus: DeliveryPersonStatus): void {
    this.status = newStatus;
  }

  private updateAverageRating(newRating: number): void {
    const totalRating = (this.rating * (this.completedDeliveries - 1)) + newRating;
    this.rating = Math.round((totalRating / this.completedDeliveries) * 100) / 100;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      vehicleType: this.vehicleType,
      licenseNumber: this.licenseNumber,
      rating: this.rating,
      completedDeliveries: this.completedDeliveries,
      status: this.status,
      isDocumentationVerified: this.isDocumentationVerified,
      isCurrentlyDelivering: this.isCurrentlyDelivering(),
    };
  }
} 