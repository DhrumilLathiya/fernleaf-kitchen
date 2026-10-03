import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /** Req 4.11 - Role-aware dashboard KPIs */
  async getMetrics(role: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const todayFilter = { deliveryDate: { gte: today, lt: tomorrow } };

    const [todayOrders, inKitchen, readyToDispatch, outstanding] = await Promise.all([
      this.prisma.order.count({ where: { ...todayFilter } }),
      this.prisma.combination.count({
        where: { isStarted: true, isDone: false, orderLine: { order: { ...todayFilter } } },
      }),
      this.prisma.order.count({ where: { ...todayFilter, status: 'CONFIRMED' } }),
      this.prisma.invoice.count({ where: { isPaid: false } }),
    ]);

    if (role === 'KITCHEN') {
      const stations = await this.prisma.combination.groupBy({
        by: ['kitchenStation'],
        where: { isDone: false, orderLine: { order: { ...todayFilter, status: 'CONFIRMED' } } },
        _count: true,
      });
      return { todayOrders, inKitchen, stations };
    }

    if (role === 'DISPATCH') {
      return { todayOrders, readyToDispatch };
    }

    if (role === 'DRIVER') {
      return { myDeliveries: readyToDispatch };
    }

    // ADMIN
    const recentOrders = await this.prisma.order.findMany({
      where: todayFilter,
      include: { employee: { include: { company: true } } },
      orderBy: { deliveryDate: 'desc' },
      take: 5,
    });

    return { todayOrders, inKitchen, readyToDispatch, outstanding, recentOrders };
  }
}
