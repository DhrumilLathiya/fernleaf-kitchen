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
exports.DispatchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DispatchService = class DispatchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDrops(date) {
        const orders = await this.prisma.order.findMany({
            where: {
                deliveryDate: new Date(date),
                status: { in: ['CONFIRMED'] },
            },
            include: {
                employee: { include: { company: true } },
                driver: true,
                lines: { include: { dish: true, combinations: true } },
            },
            orderBy: { deliveryTime: 'asc' },
        });
        const dropsMap = new Map();
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
            drop.totalMeals += order.lines.reduce((s, l) => s + l.dishQuantity, 0);
        }
        return Array.from(dropsMap.values());
    }
    async assignDriver(dropKey, driverId) {
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
    async getMyDeliveries(driverId) {
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
    async markDelivered(orderId, data) {
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
};
exports.DispatchService = DispatchService;
exports.DispatchService = DispatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DispatchService);
//# sourceMappingURL=dispatch.service.js.map