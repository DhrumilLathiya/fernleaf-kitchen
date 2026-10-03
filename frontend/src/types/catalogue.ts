export type DietaryTag = 'Vegan' | 'Vegetarian' | 'Gluten Free' | 'High Protein' | 'Dairy Free';

export interface Category {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  isSecret: boolean;
}

export interface DishPrice {
  id: string;
  price: number;
  tier: { id: string; name: string; isDefault: boolean };
}

export interface Dish {
  id: string;
  name: string;
  description?: string;
  sku: string;
  temperature: 'HOT' | 'COLD';
  costPrice: number;
  allergens: string[];
  dietaryTags: string[];
  kitchenStation?: string;
  minOrderQuantity: number;
  isActive: boolean;
  categoryId: string;
  category: Category;
  prices: DishPrice[];
}
