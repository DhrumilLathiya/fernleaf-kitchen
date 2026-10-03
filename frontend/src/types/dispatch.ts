export interface DispatchDrop {
  dropId: string;
  company: {
    id: string;
    name: string;
  };
  deliveryAddress: string;
  deliveryTime: string;
  driver: {
    id: string;
    email: string;
  } | null;
  orders: {
    id: string;
    employee: {
      firstName: string;
      lastName: string;
    };
    lines: {
      dishQuantity: number;
      dish: {
        name: string;
      };
    }[];
  }[];
  totalMeals: number;
  isKitchenReady?: boolean;
}

export interface Driver {
  id: string;
  email: string;
}
