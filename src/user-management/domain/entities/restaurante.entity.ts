import { User } from './user.entity';
import { Address } from '../value-objects/address.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export enum RestauranteRole {
  OWNER = 'dueño',
  MANAGER = 'gerente',
  EMPLOYEE = 'empleado',
}

export class Restaurante extends User {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
    addresses: Address[] = [],
    private restaurantId?: string,
    private restaurantRole: RestauranteRole = RestauranteRole.EMPLOYEE,
    private permissions: string[] = [],
  ) {
    super(
      id,
      firstName,
      lastName,
      contactInfo,
      credentials,
      UserRole.RESTAURANT_USER,
      addresses,
    );
  }

  static create(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
  ): Restaurante {
    return new Restaurante(id, firstName, lastName, contactInfo, credentials);
  }

  joinRestaurant(restaurantId: string, role: RestauranteRole): void {
    this.ensureCanJoinRestaurant();
    this.validateRestaurantId(restaurantId);

    this.restaurantId = restaurantId;
    this.restaurantRole = role;
    this.assignRolePermissions(role);
  }

  leaveRestaurant(): void {
    this.ensureCanLeaveRestaurant();

    this.restaurantId = undefined;
    this.restaurantRole = RestauranteRole.EMPLOYEE;
    this.permissions = [];
  }

  isRestaurantOwner(): boolean {
    return this.restaurantRole === RestauranteRole.OWNER;
  }

  isRestaurantManager(): boolean {
    return this.restaurantRole === RestauranteRole.MANAGER;
  }

  isRestaurantEmployee(): boolean {
    return this.restaurantRole === RestauranteRole.EMPLOYEE;
  }

  belongsToRestaurant(): boolean {
    return !!this.restaurantId;
  }

  get currentRestaurantId(): string | undefined {
    return this.restaurantId;
  }

  get currentRole(): RestauranteRole {
    return this.restaurantRole;
  }

  get allPermissions(): string[] {
    return [...this.permissions];
  }

  private ensureCanJoinRestaurant(): void {
    if (this.belongsToRestaurant()) {
      throw new Error('Ya perteneces a un restaurante. Debes salir primero');
    }
  }

  private ensureCanLeaveRestaurant(): void {
    if (!this.belongsToRestaurant()) {
      throw new Error('No perteneces a ningún restaurante');
    }
  }

  private validateRestaurantId(restaurantId: string): void {
    if (!restaurantId?.trim()) {
      throw new Error('El ID del restaurante es requerido');
    }
  }

  private validatePermission(permission: string): void {
    if (!permission?.trim()) {
      throw new Error('El permiso no puede estar vacío');
    }
  }

  private ensurePermissionNotAlreadyGranted(permission: string): void {
    if (this.permissions.includes(permission)) {
      throw new Error('Este permiso ya ha sido otorgado');
    }
  }

  private ensurePermissionExists(permission: string): void {
    if (!this.permissions.includes(permission)) {
      throw new Error('Este permiso no existe para ser revocado');
    }
  }

  private assignRolePermissions(role: RestauranteRole): void {
    switch (role) {
      case RestauranteRole.OWNER:
        this.permissions = [
          'manage_restaurant',
          'manage_menu',
          'manage_orders',
          'manage_staff',
          'view_analytics',
          'manage_settings',
        ];
        break;
      case RestauranteRole.MANAGER:
        this.permissions = ['manage_menu', 'manage_orders', 'view_analytics'];
        break;
      case RestauranteRole.EMPLOYEE:
        this.permissions = ['view_orders', 'update_order_status'];
        break;
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      restaurantId: this.restaurantId,
      restaurantRole: this.restaurantRole,
      permissions: this.permissions,
      belongsToRestaurant: this.belongsToRestaurant(),
    };
  }
}
