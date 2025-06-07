import { UserRole } from '../../domain/enums/user-role.enum';

export class ContactInfoResponseDto {
  email: string;
  phone: string;

  constructor(email: string, phone: string) {
    this.email = email;
    this.phone = phone;
  }
}

export class AddressResponseDto {
  street: string;
  number: string;
  city: string;
  state: string;
  postalCode: string;
  references?: string;

  constructor(
    street: string,
    number: string,
    city: string,
    state: string,
    postalCode: string,
    references?: string,
  ) {
    this.street = street;
    this.number = number;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.references = references;
  }

  getFullAddress(): string {
    return `${this.street} ${this.number}, ${this.city}, ${this.state} ${this.postalCode}`;
  }
}

export class UserResponseDto {
  id: string;
  name: string;
  lastName?: string;
  fullName: string;
  contact: ContactInfoResponseDto;
  role: UserRole;
  addresses: AddressResponseDto[];
  isActive: boolean;

  constructor(
    id: string,
    name: string,
    lastName: string | null,
    fullName: string,
    contact: ContactInfoResponseDto,
    role: UserRole,
    addresses: AddressResponseDto[] = [],
    isActive: boolean = true,
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName ?? undefined;
    this.fullName = fullName;
    this.contact = contact;
    this.role = role;
    this.addresses = addresses;
    this.isActive = isActive;
  }
}
