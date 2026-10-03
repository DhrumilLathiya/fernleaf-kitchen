import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DispatchService {
  constructor(private prisma: PrismaService) {}

  /** Req 4.8: Get orders grouped by company/address/time (drops) for a given date */
  async getDrops(date: string) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const orders = await this.prisma.order.findMany({
      where: {
        deliveryDate: { gte: startOfDay, lte: endOfDay },
        status: { in: ['CONFIRMED'] },
      },
      include: {
        employee: { include: { company: true } },
        driver: true,
        lines: { include: { dish: true, combinations: true } },
      },
      orderBy: { deliveryTime: 'asc' },
    });

    // Group by companyId + deliveryAddress + deliveryTime = a "drop"
    const dropsMap = new Map<string, any>();
    for (const order of orders) {
      const key = `${order.employee.companyId}|${order.deliveryAddress}|${order.deliveryTime}`;
      if (!dropsMap.has(key)) {
        dropsMap.set(key, {
          dropId: key,
          company: order.employee.company,
          deliveryAddress: order.deliveryAddress,
          deliveryTime: order.deliveryTime,
          driver: order.driver,
          orders: [],
          totalMeals: 0,
        });
      }
      const drop = dropsMap.get(key);
      drop.orders.push(order);
      drop.totalMeals += order.lines.reduce((s: number, l: any) => s + l.dishQuantity, 0);
    }

    return Array.from(dropsMap.values());
  }

  /** Get all drivers */
  async getDrivers() {
    return this.prisma.staff.findMany({
      where: { role: 'DRIVER' },
      select: { id: true, email: true },
    });
  }

  /** Assign a driver to all orders in a drop */
  async assignDriver(dropKey: string, driverId: string) {
    const [companyId, deliveryAddress, deliveryTime] = dropKey.split('|');
    return this.prisma.order.updateMany({
      where: {
        employee: { companyId },
        deliveryAddress,
        deliveryTime,
        status: 'CONFIRMED',
      },
      data: { driverId },
    });
  }

  /** Driver: get my deliveries for today */
  async getMyDeliveries(driverId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return this.prisma.order.findMany({
      where: {
        driverId,
        deliveryDate: today,
        status: { in: ['CONFIRMED', 'DELIVERED'] },
      },
      include: { employee: { include: { company: true } }, lines: true },
      orderBy: { deliveryTime: 'asc' },
    });
  }

  /** Driver: mark an order as delivered */
  async markDelivered(orderId: string, data: { note?: string; photo?: string; isOnTime?: boolean }) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
        deliveryNote: data.note,
        deliveryPhoto: data.photo,
        isOnTime: data.isOnTime,
      },
    });
  }
}
