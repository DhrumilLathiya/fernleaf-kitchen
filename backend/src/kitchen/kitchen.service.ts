import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KitchenService {
  constructor(private prisma: PrismaService) {}

  /** Req 4.7 - Get all prep units (combinations) for a date grouped by station */
  async getBoard(date: string, station?: string) {
    const deliveryDate = new Date(date);
    const combinations = await this.prisma.combination.findMany({
      where: {
        orderLine: {
          order: {
            deliveryDate,
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
    return this.prisma.combination.update({
      where: { id },
      data: { isStarted: true, startedAt: new Date() },
    });
  }

  /** Mark a prep unit as done (auto-start if missed) */
  async doneUnit(id: string) {
    const now = new Date();
    return this.prisma.combination.update({
      where: { id },
      data: {
        isDone: true,
        doneAt: now,
        isStarted: true,
        startedAt: now, // Set start if missed
      },
    });
  }
}
