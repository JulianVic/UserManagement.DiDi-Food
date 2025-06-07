import { User } from './user.entity';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export class DeliveryUser extends User {
  public profilePictureUrl?: string;
  public vehicleType?: 'moto' | 'carro' | 'bicicleta';

  static create(
    id: string,
    name: string,
    lastName: string,
    contact: ContactInfo,
    credentials: Credentials,
  ): DeliveryUser {
    return new DeliveryUser(id, name, lastName, contact, credentials);
  }

  private constructor(
    id: string,
    name: string,
    lastName: string,
    contact: ContactInfo,
    credentials: Credentials,
  ) {
    super(id, name, lastName, contact, credentials, UserRole.DELIVERY_PERSON);
  }

  public completeProfile(
    profilePictureUrl: string,
    vehicleType: 'moto' | 'carro' | 'bicicleta',
  ): void {
    this.profilePictureUrl = profilePictureUrl;
    this.vehicleType = vehicleType;
  }
}
