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
exports.KitchenService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KitchenService = class KitchenService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBoard(date, station) {
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
    async startUnit(id) {
        return this.prisma.combination.update({
            where: { id },
            data: { isStarted: true, startedAt: new Date() },
        });
    }
    async doneUnit(id) {
        const now = new Date();
        return this.prisma.combination.update({
            where: { id },
            data: {
                isDone: true,
                doneAt: now,
                isStarted: true,
                startedAt: now,
            },
        });
    }
};
exports.KitchenService = KitchenService;
exports.KitchenService = KitchenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KitchenService);
//# sourceMappingURL=kitchen.service.js.map