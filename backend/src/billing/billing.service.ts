import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  /** Get confirmed, un-invoiced orders for a company - Req 4.9 */
  async getUnInvoiced(companyId: string) {
    return this.prisma.order.findMany({
      where: {
        employee: { companyId },
        status: { in: ['CONFIRMED', 'DELIVERED'] },
        invoiceId: null,
      },
      include: {
        employee: true,
        lines: { include: { dish: true, combinations: true } },
      },
    });
  }

  /** Create an invoice grouping selected orders */
  async createInvoice(companyId: string, orderIds: string[]) {
    return this.prisma.invoice.create({
      data: {
        companyId,
        orders: { connect: orderIds.map((id) => ({ id })) },
      },
      include: { orders: true, company: true },
    });
  }

  /** Mark invoice as paid */
  async markPaid(invoiceId: string) {
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { isPaid: true },
    });
  }

  /** List all invoices (optionally for a company) */
  async listInvoices(companyId?: string) {
    return this.prisma.invoice.findMany({
      where: companyId ? { companyId } : {},
      include: { company: true, orders: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
