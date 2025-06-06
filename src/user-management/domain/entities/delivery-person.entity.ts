/* eslint-disable prettier/prettier */
import { User } from './user.entity';
import { Address } from '../value-objects/address.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export enum DeliveryPersonStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
}

export enum VehicleType {
  BICYCLE = 'bicycle',
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
}

export class DeliveryPerson extends User {
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
  ): DeliveryPerson {
    return new DeliveryPerson(id, firstName, lastName, contactInfo, credentials);
  }

  // Métodos específicos del repartidor
  setVehicleInformation(vehicleType: VehicleType, licenseNumber: string): void {
    if (!licenseNumber?.trim()) {
      throw new Error('El número de licencia es requerido');
    }
    this.vehicleType = vehicleType;
    this.licenseNumber = licenseNumber;
    this.updateTimestamp();
  }

  updateStatus(status: DeliveryPersonStatus): void {
    if (!this.isUserVerified()) {
      throw new Error('El repartidor debe estar verificado para cambiar su estado');
    }
    this.status = status;
    this.updateTimestamp();
  }

  completeDelivery(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }
    
    this.completedDeliveries += 1;
    
    // Calcular nueva calificación promedio
    const totalRating = (this.rating * (this.completedDeliveries - 1)) + rating;
    this.rating = Math.round((totalRating / this.completedDeliveries) * 100) / 100;
    
    this.updateTimestamp();
  }

  verifyDocumentation(): void {
    if (!this.vehicleType || !this.licenseNumber) {
      throw new Error('La información del vehículo debe estar completa antes de verificar documentación');
    }
    this.isDocumentationVerified = true;
    this.updateTimestamp();
  }

  canReceiveDeliveries(): boolean {
    return (
      this.isUserActive() &&
      this.isUserVerified() &&
      this.isDocumentationVerified &&
      this.status === DeliveryPersonStatus.AVAILABLE
    );
  }

  // Getters específicos
  getVehicleType(): VehicleType | undefined {
    return this.vehicleType;
  }

  getLicenseNumber(): string | undefined {
    return this.licenseNumber;
  }

  getRating(): number {
    return this.rating;
  }

  getCompletedDeliveries(): number {
    return this.completedDeliveries;
  }

  getStatus(): DeliveryPersonStatus {
    return this.status;
  }

  isDocumentationComplete(): boolean {
    return this.isDocumentationVerified;
  }

  private updateTimestamp(): void {
    (this as any).updatedAt = new Date();
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
      canReceiveDeliveries: this.canReceiveDeliveries(),
    };
  }
} 