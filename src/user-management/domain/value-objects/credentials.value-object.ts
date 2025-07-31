export class Credentials {
  constructor(
    private readonly username: string,
    private readonly hashedPassword: string,
  ) {
    this.validateCredentials();
  }

  static fromPersisted(username: string, hashedPassword: string): Credentials {
    if (!username?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }
    if (username.length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }
    if (username.length > 50) {
      throw new Error(
        'El nombre de usuario no puede tener más de 50 caracteres',
      );
    }
    const usernameRegex = /^[a-zA-Z0-9_.-@]+$/;
    if (!usernameRegex.test(username)) {
      throw new Error(
        'El nombre de usuario solo puede contener letras, números, puntos, guiones, guiones bajos y @',
      );
    }

    return Object.assign(Object.create(Credentials.prototype), {
      username,
      hashedPassword,
    }) as Credentials;
  }

  private validateCredentials(): void {
    this.validateUsername();
    this.validatePassword(this.hashedPassword);
  }

  private validateUsername(): void {
    if (!this.username?.trim()) {
      throw new Error('El nombre de usuario es requerido');
    }

    if (this.username.length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
    }

    if (this.username.length > 50) {
      throw new Error(
        'El nombre de usuario no puede tener más de 50 caracteres',
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_.-@]+$/;
    if (!usernameRegex.test(this.username)) {
      throw new Error(
        'El nombre de usuario solo puede contener letras, números, puntos, guiones, guiones bajos y @',
      );
    }
  }

  private validatePassword(password: string): void {
    if (!password?.trim()) {
      throw new Error('La contraseña es requerida');
    }

    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (password.length > 128) {
      throw new Error('La contraseña no puede tener más de 128 caracteres');
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        'La contraseña debe contener al menos: una mayúscula, una minúscula, un número y un carácter especial',
      );
    }
  }

  getUsername(): string {
    return this.username;
  }

  getHashedPassword(): string {
    return this.hashedPassword;
  }

  equals(other: Credentials): boolean {
    return (
      this.username === other.username &&
      this.hashedPassword === other.hashedPassword
    );
  }

  toJSON() {
    return {
      username: this.username,
      hashedPassword: '[PROTECTED]',
    };
  }
}
