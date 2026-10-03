import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async getAll(companyId?: string) {
    return this.prisma.employee.findMany({
      where: companyId ? { companyId } : {},
      include: { company: true },
    });
  }

  async getOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: { company: { include: { priceTier: true } } },
    });
  }

  async create(data: any) {
    return this.prisma.employee.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.employee.update({ where: { id }, data });
  }
}
