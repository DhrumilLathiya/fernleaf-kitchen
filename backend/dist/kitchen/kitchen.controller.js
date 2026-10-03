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
exports.KitchenController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const kitchen_service_1 = require("./kitchen.service");
const roles_guard_1 = require("../auth/roles.guard");
let KitchenController = class KitchenController {
    kitchenService;
    constructor(kitchenService) {
        this.kitchenService = kitchenService;
    }
    getBoard(date, station) {
        return this.kitchenService.getBoard(date, station);
    }
    startUnit(id) { return this.kitchenService.startUnit(id); }
    doneUnit(id) { return this.kitchenService.doneUnit(id); }
};
exports.KitchenController = KitchenController;
__decorate([
    (0, common_1.Get)('board'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('station')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], KitchenController.prototype, "getBoard", null);
__decorate([
    (0, common_1.Post)('units/:id/start'),
    (0, roles_guard_1.Roles)('ADMIN', 'KITCHEN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KitchenController.prototype, "startUnit", null);
__decorate([
    (0, common_1.Post)('units/:id/done'),
    (0, roles_guard_1.Roles)('ADMIN', 'KITCHEN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KitchenController.prototype, "doneUnit", null);
exports.KitchenController = KitchenController = __decorate([
    (0, common_1.Controller)('kitchen'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [kitchen_service_1.KitchenService])
], KitchenController);
//# sourceMappingURL=kitchen.controller.js.map