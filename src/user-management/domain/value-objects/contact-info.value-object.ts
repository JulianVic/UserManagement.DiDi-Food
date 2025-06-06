export class ContactInfo {
  constructor(
    private readonly email: string,
    private readonly phone: string,
  ) {
    this.validateContactInfo();
  }

  private validateContactInfo(): void {
    this.validateEmail();
    this.validatePhone();
  }

  private validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('El formato del email es inválido');
    }
  }

  private validatePhone(): void {
    // Validar formato de teléfono mexicano (puede incluir +52)
    const phoneRegex = /^(\+52)?[1-9]\d{9}$/;
    const cleanPhone = this.phone.replace(/[\s\-()]/g, '');

    if (!phoneRegex.test(cleanPhone)) {
      throw new Error(
        'El formato del teléfono es inválido (debe ser un número mexicano válido)',
      );
    }
  }

  getEmail(): string {
    return this.email;
  }

  getPhone(): string {
    return this.phone;
  }

  getFormattedPhone(): string {
    const cleanPhone = this.phone.replace(/[\s\-()]/g, '');

    if (cleanPhone.startsWith('+52')) {
      const number = cleanPhone.substring(3);
      return `+52 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    } else {
      return `${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
    }
  }

  equals(other: ContactInfo): boolean {
    return this.email === other.email && this.phone === other.phone;
  }

  toJSON() {
    return {
      email: this.email,
      phone: this.phone,
      formattedPhone: this.getFormattedPhone(),
    };
  }
}
