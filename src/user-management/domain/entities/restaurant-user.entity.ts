import { User } from './user.entity';
import { Address } from '../value-objects/address.value-object';
import { ContactInfo } from '../value-objects/contact-info.value-object';
import { Credentials } from '../value-objects/credentials.value-object';
import { UserRole } from '../enums/user-role.enum';

export enum RestaurantRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff',
}

export class RestaurantUser extends User {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
    addresses: Address[] = [],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    isActive: boolean = true,
    isVerified: boolean = false,
    private restaurantId?: string,
    private restaurantRole: RestaurantRole = RestaurantRole.STAFF,
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
      createdAt,
      updatedAt,
      isActive,
      isVerified,
    );
  }

  static create(
    id: string,
    firstName: string,
    lastName: string,
    contactInfo: ContactInfo,
    credentials: Credentials,
  ): RestaurantUser {
    return new RestaurantUser(id, firstName, lastName, contactInfo, credentials);
  }

  // Métodos específicos del usuario de restaurante
  assignToRestaurant(restaurantId: string, role: RestaurantRole): void {
    if (!restaurantId?.trim()) {
      throw new Error('El ID del restaurante es requerido');
    }
    this.restaurantId = restaurantId;
    this.restaurantRole = role;
    this.setDefaultPermissions(role);
    this.updateTimestamp();
  }

  updateRestaurantRole(role: RestaurantRole): void {
    if (!this.restaurantId) {
      throw new Error('El usuario debe estar asignado a un restaurante primero');
    }
    this.restaurantRole = role;
    this.setDefaultPermissions(role);
    this.updateTimestamp();
  }

  addPermission(permission: string): void {
    if (!permission?.trim()) {
      throw new Error('El permiso no puede estar vacío');
    }
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
      this.updateTimestamp();
    }
  }

  removePermission(permission: string): void {
    const index = this.permissions.indexOf(permission);
    if (index > -1) {
      this.permissions.splice(index, 1);
      this.updateTimestamp();
    }
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  private setDefaultPermissions(role: RestaurantRole): void {
    switch (role) {
      case RestaurantRole.OWNER:
        this.permissions = [
          'manage_restaurant',
          'manage_menu',
          'manage_orders',
          'manage_staff',
          'view_analytics',
          'manage_settings',
        ];
        break;
      case RestaurantRole.MANAGER:
        this.permissions = [
          'manage_menu',
          'manage_orders',
          'view_analytics',
        ];
        break;
      case RestaurantRole.STAFF:
        this.permissions = [
          'view_orders',
          'update_order_status',
        ];
        break;
    }
  }

  canManageRestaurant(): boolean {
    return this.hasPermission('manage_restaurant');
  }

  canManageMenu(): boolean {
    return this.hasPermission('manage_menu');
  }

  canManageOrders(): boolean {
    return this.hasPermission('manage_orders');
  }

  // Getters específicos
  getRestaurantId(): string | undefined {
    return this.restaurantId;
  }

  getRestaurantRole(): RestaurantRole {
    return this.restaurantRole;
  }

  getPermissions(): string[] {
    return [...this.permissions];
  }

  private updateTimestamp(): void {
    (this as any).updatedAt = new Date();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      restaurantId: this.restaurantId,
      restaurantRole: this.restaurantRole,
      permissions: this.permissions,
      capabilities: {
        canManageRestaurant: this.canManageRestaurant(),
        canManageMenu: this.canManageMenu(),
        canManageOrders: this.canManageOrders(),
      },
    };
  }
} 