import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { CutoffService } from './cutoff.service';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
    private cutoffService: CutoffService,
    private pricingService: PricingService,
  ) {}

  async getAll(query: { date?: string; companyId?: string; status?: string; search?: string; page?: number; limit?: number }) {
    const { date, companyId, status, search, page = 1, limit = 20 } = query;
    const where: any = {};
    if (date) where.deliveryDate = new Date(date);
    if (status) where.status = status;
    if (companyId) where.employee = { companyId };
    if (search) where.employee = { OR: [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ]};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { employee: { include: { company: true } }, lines: { include: { dish: true } } },
        orderBy: { deliveryDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  async getOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        employee: { include: { company: { include: { priceTier: true } } } },
        lines: { include: { dish: true, combinations: true } },
        driver: true,
        invoice: true,
      },
    });
  }

  async create(data: {
    employeeId: string;
    deliveryDate: string;
    deliveryTime: string;
    deliveryAddress: string;
    packaging: string;
    lines: Array<{
      dishId: string;
      dishQuantity: number;
      combinations: Array<{
        quantity: number;
        chosenOptions: Array<{ optionId: string; name: string; price: number; size?: string }>;
      }>;
    }>;
    status?: 'DRAFT' | 'PLACED';
  }) {
    const settings = await this.settingsService.getSettings();
    const deliveryDate = new Date(data.deliveryDate);

    // Validate cut-off
    if (data.status === 'PLACED') {
      const cutoff = this.cutoffService.calculateCutoffDate(deliveryDate, settings as any);
      if (new Date() > cutoff) {
        throw new BadRequestException(`Order cut-off for ${data.deliveryDate} was ${cutoff.toISOString()}.`);
      }
    }

    // Fetch employee to resolve pricing tier
    const employee = await this.prisma.employee.findUnique({
      where: { id: data.employeeId },
      include: { company: { include: { priceTier: true } } },
    });

    const tierId = employee?.company?.priceTierId ?? '';

    // Calculate total
    let totalAmount = 0;
    const linesData = await Promise.all(data.lines.map(async (line) => {
      const dishPrice = tierId
        ? await this.pricingService.resolvePrice(line.dishId, tierId).catch(() => 0)
        : 0;
      
      const combinationsData = line.combinations.map((combo) => {
        const optionsTotal = combo.chosenOptions.reduce((s, o) => s + o.price, 0);
        const combinationTotal = (dishPrice + optionsTotal) * combo.quantity;
        totalAmount += combinationTotal;
        return {
          quantity: combo.quantity,
          totalPrice: combinationTotal,
          chosenOptions: combo.chosenOptions,
        };
      });

      return { dishId: line.dishId, dishQuantity: line.dishQuantity, dishPrice, combinations: combinationsData };
    }));

    return this.prisma.order.create({
      data: {
        employeeId: data.employeeId,
        deliveryDate,
        deliveryTime: data.deliveryTime,
        deliveryAddress: data.deliveryAddress,
        packaging: data.packaging,
        status: data.status ?? 'DRAFT',
        totalAmount,
        lines: {
          create: linesData.map((line) => ({
            dishId: line.dishId,
            dishQuantity: line.dishQuantity,
            dishPrice: line.dishPrice,
            combinations: { create: line.combinations },
          })),
        },
      },
      include: { lines: { include: { combinations: true } } },
    });
  }

  /**
   * Process cut-off: cancel all DRAFTs and confirm all PLACED orders for a given date.
   * Requirement 4.6
   */
  async processCutoff(deliveryDate: string) {
    const date = new Date(deliveryDate);
    const [cancelled, confirmed] = await Promise.all([
      this.prisma.order.updateMany({
        where: { deliveryDate: date, status: 'DRAFT' },
        data: { status: 'CANCELLED' },
      }),
      this.prisma.order.updateMany({
        where: { deliveryDate: date, status: 'PLACED' },
        data: { status: 'CONFIRMED' },
      }),
    ]);
    return { cancelled: cancelled.count, confirmed: confirmed.count };
  }
}
