import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.company.findMany({
      include: { priceTier: true, defaultDriver: true, _count: { select: { employees: true } } },
    });
  }

  async getOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: { priceTier: true, employees: true, invoices: true },
    });
  }

  async create(data: any) {
    return this.prisma.company.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.company.update({ where: { id }, data });
  }
}
