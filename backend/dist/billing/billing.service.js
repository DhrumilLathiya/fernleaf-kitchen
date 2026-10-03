"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BillingService = class BillingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUnInvoiced(companyId) {
        return this.prisma.order.findMany({
            where: {
                employee: { companyId },
                status: 'CONFIRMED',
                invoiceId: null,
            },
            include: {
                employee: true,
                lines: { include: { dish: true, combinations: true } },
            },
        });
    }
    async createInvoice(companyId, orderIds) {
        return this.prisma.invoice.create({
            data: {
                companyId,
                orders: { connect: orderIds.map((id) => ({ id })) },
            },
            include: { orders: true, company: true },
        });
    }
    async markPaid(invoiceId) {
        return this.prisma.invoice.update({
            where: { id: invoiceId },
            data: { isPaid: true },
        });
    }
    async listInvoices(companyId) {
        return this.prisma.invoice.findMany({
            where: companyId ? { companyId } : {},
            include: { company: true, orders: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map