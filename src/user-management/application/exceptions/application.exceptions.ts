export class UserNotFoundException extends Error {
  constructor(identifier: string, type: 'id' | 'email' = 'id') {
    super(`Usuario no encontrado con ${type}: ${identifier}`);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`Ya existe un usuario con el email: ${email}`);
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidUserDataException extends Error {
  constructor(message: string) {
    super(`Datos de usuario inválidos: ${message}`);
    this.name = 'InvalidUserDataException';
  }
}

export class MaxAddressesReachedException extends Error {
  constructor() {
    super('El usuario no puede tener más de 5 direcciones');
    this.name = 'MaxAddressesReachedException';
  }
}

export class InvalidAddressException extends Error {
  constructor(message: string) {
    super(`Dirección inválida: ${message}`);
    this.name = 'InvalidAddressException';
  }
}

export class UserOperationException extends Error {
  constructor(operation: string, reason: string) {
    super(`Error en operación ${operation}: ${reason}`);
    this.name = 'UserOperationException';
  }
}
