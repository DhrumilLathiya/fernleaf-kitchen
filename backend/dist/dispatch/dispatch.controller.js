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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const dispatch_service_1 = require("./dispatch.service");
const roles_guard_1 = require("../auth/roles.guard");
let DispatchController = class DispatchController {
    dispatchService;
    constructor(dispatchService) {
        this.dispatchService = dispatchService;
    }
    getDrops(date) {
        return this.dispatchService.getDrops(date ?? new Date().toISOString().split('T')[0]);
    }
    assignDriver(dropKey, body) {
        return this.dispatchService.assignDriver(dropKey, body.driverId);
    }
    getMyDeliveries(req) {
        return this.dispatchService.getMyDeliveries(req.user.id);
    }
    markDelivered(orderId, body) {
        return this.dispatchService.markDelivered(orderId, body);
    }
};
exports.DispatchController = DispatchController;
__decorate([
    (0, common_1.Get)('dispatch/drops'),
    (0, roles_guard_1.Roles)('ADMIN', 'DISPATCH', 'DRIVER'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "getDrops", null);
__decorate([
    (0, common_1.Post)('dispatch/drops/:dropKey/assign'),
    (0, roles_guard_1.Roles)('ADMIN', 'DISPATCH'),
    __param(0, (0, common_1.Param)('dropKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "assignDriver", null);
__decorate([
    (0, common_1.Get)('driver/deliveries'),
    (0, roles_guard_1.Roles)('DRIVER', 'ADMIN'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "getMyDeliveries", null);
__decorate([
    (0, common_1.Post)('driver/deliveries/:orderId/deliver'),
    (0, roles_guard_1.Roles)('DRIVER', 'ADMIN'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DispatchController.prototype, "markDelivered", null);
exports.DispatchController = DispatchController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [dispatch_service_1.DispatchService])
], DispatchController);
//# sourceMappingURL=dispatch.controller.js.map