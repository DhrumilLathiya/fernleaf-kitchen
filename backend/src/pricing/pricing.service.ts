import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async getAllTiers() {
    return this.prisma.priceTier.findMany({
      include: { dishPrices: true, optionPrices: true },
    });
  }

  async createTier(data: { name: string; isDefault?: boolean; derivedFrom?: string }) {
    return this.prisma.priceTier.create({ data });
  }

  async setDishPrice(dishId: string, tierId: string, price: number) {
    return this.prisma.dishPrice.upsert({
      where: { dishId_tierId: { dishId, tierId } },
      create: { dishId, tierId, price },
      update: { price },
    });
  }

  /**
   * Resolve the price for a specific dish for a specific employee.
   * If no company tier price exists, falls back to the default tier.
   * Requirement 4.3: Pricing Tiers
   */
  async resolvePrice(dishId: string, tierId: string): Promise<number> {
    // Try to find price for the specific tier
    const tierPrice = await this.prisma.dishPrice.findUnique({
      where: { dishId_tierId: { dishId, tierId } },
    });
    if (tierPrice) return tierPrice.price;

    // Fall back to default tier
    const defaultTier = await this.prisma.priceTier.findFirst({
      where: { isDefault: true },
      include: { dishPrices: { where: { dishId } } },
    });
    if (defaultTier?.dishPrices?.[0]) return defaultTier.dishPrices[0].price;

    throw new Error(`No price found for dish ${dishId} in any tier.`);
  }
}
