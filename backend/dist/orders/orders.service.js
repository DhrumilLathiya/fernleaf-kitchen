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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const settings_service_1 = require("../settings/settings.service");
const cutoff_service_1 = require("./cutoff.service");
const pricing_service_1 = require("../pricing/pricing.service");
let OrdersService = class OrdersService {
    prisma;
    settingsService;
    cutoffService;
    pricingService;
    constructor(prisma, settingsService, cutoffService, pricingService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
        this.cutoffService = cutoffService;
        this.pricingService = pricingService;
    }
    async getAll(query) {
        const { date, companyId, status, search, page = 1, limit = 20 } = query;
        const where = {};
        if (date)
            where.deliveryDate = new Date(date);
        if (status)
            where.status = status;
        if (companyId)
            where.employee = { companyId };
        if (search)
            where.employee = { OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { company: { name: { contains: search, mode: 'insensitive' } } },
                ] };
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
    async getOne(id) {
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
    async create(data) {
        const settings = await this.settingsService.getSettings();
        const deliveryDate = new Date(data.deliveryDate);
        if (data.status === 'PLACED') {
            const cutoff = this.cutoffService.calculateCutoffDate(deliveryDate, settings);
            if (new Date() > cutoff) {
                throw new common_1.BadRequestException(`Order cut-off for ${data.deliveryDate} was ${cutoff.toISOString()}.`);
            }
        }
        const employee = await this.prisma.employee.findUnique({
            where: { id: data.employeeId },
            include: { company: { include: { priceTier: true } } },
        });
        const tierId = employee?.company?.priceTierId ?? '';
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
    async processCutoff(deliveryDate) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService,
        cutoff_service_1.CutoffService,
        pricing_service_1.PricingService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map