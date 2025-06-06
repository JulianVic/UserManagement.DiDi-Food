export enum UserRole {
  CUSTOMER = 'cliente',
  DELIVERY_PERSON = 'repartidor',
  RESTAURANT_USER = 'restaurante',
}

export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.CUSTOMER]: 'Cliente',
  [UserRole.DELIVERY_PERSON]: 'Repartidor',
  [UserRole.RESTAURANT_USER]: 'Restaurante',
} as const;
