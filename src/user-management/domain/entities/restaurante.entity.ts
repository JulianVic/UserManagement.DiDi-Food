import { UserRole } from '../enums/user-role.enum';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { User } from './user.entity';

export class Restaurant extends User {
  static create(
    id: string,
    name: string,
    contact: ContactInfo,
    credentials: Credentials,
  ): Restaurant {
    return new Restaurant(id, name, contact, credentials);
  }

  private constructor(
    id: string,
    name: string,
    contact: ContactInfo,
    credentials: Credentials,
  ) {
    super(id, name, null, contact, credentials, UserRole.RESTAURANT_USER);
  }
}
