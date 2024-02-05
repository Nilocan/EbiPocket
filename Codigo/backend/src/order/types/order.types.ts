export interface FilterByStatusOrderQuery {
  status: string;
}

export interface OrderParams {
  id: string;
}

export enum ORDER_STATUSES {
  OPEN = 'open',
  IN_TRANSIT = 'inTransit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
