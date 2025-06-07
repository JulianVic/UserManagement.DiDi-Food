import { User } from '../../domain/entities/user.entity';
import {
  UserResponseDto,
  ContactInfoResponseDto,
  AddressResponseDto,
} from '../dtos/user-response.dto';
import { ContactInfoDto, AddressDto } from '../dtos/create-user.dto';
import { ContactInfo } from '../../domain/value-objects/contact-info.value-object';
import { Credentials } from '../../domain/value-objects/credentials.value-object';
import { Address } from '../../domain/value-objects/adress.value-object';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    const userData = user.toJSON();

    return new UserResponseDto(
      userData.id,
      userData.name,
      userData.lastName,
      user.getFullName(),
      new ContactInfoResponseDto(
        userData.contact.email,
        userData.contact.phone,
      ),
      user.getRole(),
      [], // Las direcciones se mapearían aquí cuando estén disponibles en la entidad
      true,
    );
  }

  static toContactInfo(contactDto: ContactInfoDto): ContactInfo {
    return new ContactInfo(contactDto.email, contactDto.phone);
  }

  static toCredentials(email: string, password: string): Credentials {
    return new Credentials(email, password);
  }

  static toAddress(addressDto: AddressDto): Address {
    return new Address(
      addressDto.street,
      addressDto.number,
      addressDto.neighborhood,
      addressDto.city,
      addressDto.state,
      addressDto.zipCode,
      addressDto.country,
      addressDto.additionalInfo,
    );
  }

  static toAddresses(addressDtos: AddressDto[] = []): Address[] {
    return addressDtos.map((addressDto) => this.toAddress(addressDto));
  }

  static toContactInfoResponseDto(
    email: string,
    phone: string,
  ): ContactInfoResponseDto {
    return new ContactInfoResponseDto(email, phone);
  }

  static toAddressResponseDto(
    street: string,
    number: string,
    city: string,
    state: string,
    postalCode: string,
    references?: string,
  ): AddressResponseDto {
    return new AddressResponseDto(
      street,
      number,
      city,
      state,
      postalCode,
      references,
    );
  }

  static toAddressResponseDtos(addresses: Address[]): AddressResponseDto[] {
    return addresses.map((address) =>
      this.toAddressResponseDto(
        address.getStreet(),
        address.getNumber(),
        address.getCity(),
        address.getState(),
        address.getZipCode(),
        address.getAdditionalInfo(),
      ),
    );
  }
}
