import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DispatchService } from './dispatch.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DispatchController {
  constructor(private dispatchService: DispatchService) {}

  /** GET /api/dispatch/drops?date=YYYY-MM-DD */
  @Get('dispatch/drops')
  @Roles('ADMIN', 'DISPATCH', 'DRIVER')
  getDrops(@Query('date') date: string) {
    return this.dispatchService.getDrops(date ?? new Date().toISOString().split('T')[0]);
  }

  /** GET /api/dispatch/drivers */
  @Get('dispatch/drivers')
  @Roles('ADMIN', 'DISPATCH')
  getDrivers() {
    return this.dispatchService.getDrivers();
  }

  /** POST /api/dispatch/drops/:dropKey/assign */
  @Post('dispatch/drops/:dropKey/assign')
  @Roles('ADMIN', 'DISPATCH')
  assignDriver(@Param('dropKey') dropKey: string, @Body() body: { driverId: string }) {
    return this.dispatchService.assignDriver(dropKey, body.driverId);
  }

  /** POST /api/dispatch/drops/:dropKey/out-for-delivery */
  @Post('dispatch/drops/:dropKey/out-for-delivery')
  @Roles('ADMIN', 'DISPATCH')
  markOutForDelivery(@Param('dropKey') dropKey: string) {
    return this.dispatchService.markOutForDelivery(dropKey);
  }

  /** GET /api/driver/deliveries - Driver sees own deliveries */
  @Get('driver/deliveries')
  @Roles('DRIVER', 'ADMIN')
  getMyDeliveries(@Request() req: any) {
    return this.dispatchService.getMyDeliveries(req.user.id);
  }

  /** POST /api/driver/deliveries/:orderId/deliver */
  @Post('driver/deliveries/:orderId/deliver')
  @Roles('DRIVER', 'ADMIN')
  markDelivered(@Param('orderId') orderId: string, @Body() body: any) {
    return this.dispatchService.markDelivered(orderId, body);
  }
}
