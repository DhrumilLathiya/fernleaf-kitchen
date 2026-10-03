import type { Dish } from './catalogue';

export interface Company {
  id: string;
  name: string;
  defaultDeliveryTime: string;
  defaultPackaging: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId: string;
  company: Company;
}

export interface OrderLine {
  id: string;
  orderId: string;
  dishId: string;
  dishQuantity: number;
  dishPrice: number;
  dish: Dish;
  combinations?: any[];
}

export interface Order {
  id: string;
  employeeId: string;
  status: 'DRAFT' | 'PLACED' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'DELIVERED';
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  totalAmount: number;
  createdAt: string;
  employee: Employee;
  lines: OrderLine[];
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
