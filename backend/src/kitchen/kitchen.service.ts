import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  /** Req 4.7 - Get all prep units (combinations) for a date grouped by station */
  async getBoard(date: string, station?: string) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const combinations = await this.prisma.combination.findMany({
      where: {
        orderLine: {
          order: {
            deliveryDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: { in: ['CONFIRMED'] },
          },
        },
        ...(station ? { kitchenStation: station } : {}),
      },
      include: {
        orderLine: {
          include: {
            dish: true,
            order: { include: { employee: { include: { company: true } } } },
          },
        },
      },
      orderBy: [{ isDone: 'asc' }, { isStarted: 'asc' }],
    });
    return combinations;
  }

  /** Mark a prep unit as started */
  async startUnit(id: string) {
    const unit = await this.prisma.combination.update({
      where: { id },
      data: { isStarted: true, startedAt: new Date() },
      include: { orderLine: { select: { orderId: true } } },
    });

    const orderId = unit.orderLine.orderId;
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (order && !order.kitchenStartedAt) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { kitchenStartedAt: new Date() },
      });
    }

    return unit;
  }

  /** Mark a prep unit as done (auto-start if missed) */
  async doneUnit(id: string) {
    const now = new Date();
    const unit = await this.prisma.combination.update({
      where: { id },
      data: {
        isDone: true,
        doneAt: now,
        isStarted: true,
        startedAt: now, // Set start if missed
      },
      include: { orderLine: { select: { orderId: true } } },
    });

    const orderId = unit.orderLine.orderId;
    
    // Check if order needs kitchenStartedAt set (if it was auto-started just now)
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { lines: { include: { combinations: true } } } });
    if (order && !order.kitchenStartedAt) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { kitchenStartedAt: now },
      });
    }

    // Check if all units are done
    if (order) {
      const allDone = order.lines.every(line => line.combinations.every(c => c.isDone));
      if (allDone) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { kitchenReadyAt: now },
        });
      }
    }

    return unit;
  }
}
