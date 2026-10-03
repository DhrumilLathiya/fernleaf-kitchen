import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogueService {
  constructor(private prisma: PrismaService) {}

  // ---------- CATEGORIES ----------
  async getCategories() {
    return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
  }

  async createCategory(data: { name: string; order: number; isSecret?: boolean }) {
    return this.prisma.category.create({ data });
  }

  // ---------- DISHES ----------
  async getDishes(isActive?: boolean) {
    return this.prisma.dish.findMany({
      where: isActive !== undefined ? { isActive } : {},
      include: { category: true, optionGroups: { include: { options: true } }, prices: { include: { tier: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async getDish(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: { category: true, optionGroups: { include: { options: true } }, prices: { include: { tier: true } } },
    });
  }

  async createDish(data: {
    name: string; description?: string; sku: string; temperature: 'HOT' | 'COLD';
    costPrice: number; allergens?: string[]; dietaryTags?: string[];
    kitchenStation?: string; minOrderQuantity?: number; categoryId: string;
  }) {
    return this.prisma.dish.create({ data });
  }

  async updateDish(id: string, data: Partial<{
    name: string; description: string; costPrice: number; allergens: string[];
    dietaryTags: string[]; kitchenStation: string; minOrderQuantity: number;
    isActive: boolean; categoryId: string;
  }>) {
    return this.prisma.dish.update({ where: { id }, data });
  }

  // ---------- OPTION GROUPS ----------
  async createOptionGroup(data: {
    name: string; isRequired: boolean; displayOrder: number; dishId: string; usesPortions?: boolean;
  }) {
    return this.prisma.optionGroup.create({ data });
  }

  // ---------- OPTIONS ----------
  async createOption(data: {
    name: string; cost: number; allergens?: string[]; dietaryTags?: string[];
    displayOrder: number; groupId: string; portions?: object;
  }) {
    return this.prisma.option.create({ data: { ...data, portions: data.portions as any } });
  }
}
