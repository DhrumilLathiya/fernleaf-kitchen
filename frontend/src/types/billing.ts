import type { Order } from './order';

export interface Invoice {
  id: string;
  companyId: string;
  isPaid: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
  orders: Order[];
}
