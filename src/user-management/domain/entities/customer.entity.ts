import { User } from './user.entity';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export class Customer extends User {
  static create(
    id: string,
    name: string,
    lastName: string,
    contact: ContactInfo,
    credentials: Credentials,
  ): Customer {
    return new Customer(id, name, lastName, contact, credentials);
  }

  private constructor(
    id: string,
    name: string,
    lastName: string,
    contact: ContactInfo,
    credentials: Credentials,
  ) {
    super(id, name, lastName, contact, credentials, UserRole.CUSTOMER);
  }
}
