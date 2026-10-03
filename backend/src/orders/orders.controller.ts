import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  /** GET /api/orders */
  @Get()
  getAll(@Query() query: any) { return this.ordersService.getAll(query); }

  /** GET /api/orders/:id */
  @Get(':id')
  getOne(@Param('id') id: string) { return this.ordersService.getOne(id); }

  /** POST /api/orders */
  @Post()
  create(@Body() body: any) { return this.ordersService.create(body); }

  /** POST /api/orders/cut-off/process - Admin only */
  @Post('cut-off/process')
  @Roles('ADMIN')
  processCutoff(@Body() body: { deliveryDate: string }) {
    return this.ordersService.processCutoff(body.deliveryDate);
  }
}
