export interface KitchenCombination {
  id: string;
  orderLineId: string;
  quantity: number;
  totalPrice: number;
  chosenOptions: any;
  kitchenStation: string | null;
  isStarted: boolean;
  startedAt: string | null;
  isDone: boolean;
  doneAt: string | null;
  orderLine: {
    dish: {
      id: string;
      name: string;
      sku: string;
    };
    order: {
      id: string;
      deliveryDate: string;
      deliveryTime: string;
      employee: {
        firstName: string;
        lastName: string;
        company: {
          name: string;
        };
      };
    };
  };
}
