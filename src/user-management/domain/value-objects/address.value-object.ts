export class Address {
  constructor(
    private readonly street: string,
    private readonly number: string,
    private readonly neighborhood: string,
    private readonly city: string,
    private readonly state: string,
    private readonly zipCode: string,
    private readonly country: string,
    private readonly additionalInfo?: string,
  ) {
    this.validateAddress();
  }

  private validateAddress(): void {
    if (!this.street?.trim()) {
      throw new Error('La calle es requerida');
    }
    if (!this.number?.trim()) {
      throw new Error('El número es requerido');
    }
    if (!this.neighborhood?.trim()) {
      throw new Error('La colonia/barrio es requerida');
    }
    if (!this.city?.trim()) {
      throw new Error('La ciudad es requerida');
    }
    if (!this.state?.trim()) {
      throw new Error('El estado es requerido');
    }
    if (!this.zipCode?.trim()) {
      throw new Error('El código postal es requerido');
    }
    if (!this.country?.trim()) {
      throw new Error('El país es requerido');
    }
  }

  getFullAddress(): string {
    const baseAddress = `${this.street} ${this.number}, ${this.neighborhood}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
    return this.additionalInfo
      ? `${baseAddress} (${this.additionalInfo})`
      : baseAddress;
  }

  getStreet(): string {
    return this.street;
  }

  getNumber(): string {
    return this.number;
  }

  getNeighborhood(): string {
    return this.neighborhood;
  }

  getCity(): string {
    return this.city;
  }

  getState(): string {
    return this.state;
  }

  getZipCode(): string {
    return this.zipCode;
  }

  getCountry(): string {
    return this.country;
  }

  getAdditionalInfo(): string | undefined {
    return this.additionalInfo;
  }

  equals(other: Address): boolean {
    return (
      this.street === other.street &&
      this.number === other.number &&
      this.neighborhood === other.neighborhood &&
      this.city === other.city &&
      this.state === other.state &&
      this.zipCode === other.zipCode &&
      this.country === other.country
    );
  }

  toJSON() {
    return {
      street: this.street,
      number: this.number,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      additionalInfo: this.additionalInfo,
      fullAddress: this.getFullAddress(),
    };
  }
}
