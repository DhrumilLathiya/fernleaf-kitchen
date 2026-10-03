import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KitchenService } from './kitchen.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('kitchen')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class KitchenController {
  constructor(private kitchenService: KitchenService) {}

  /** GET /api/kitchen/board?date=YYYY-MM-DD&station=Grill */
  @Get('board')
  getBoard(@Query('date') date: string, @Query('station') station?: string) {
    return this.kitchenService.getBoard(date, station);
  }

  /** POST /api/kitchen/units/:id/start */
  @Post('units/:id/start')
  @Roles('ADMIN', 'KITCHEN')
  startUnit(@Param('id') id: string) { return this.kitchenService.startUnit(id); }

  /** POST /api/kitchen/units/:id/done */
  @Post('units/:id/done')
  @Roles('ADMIN', 'KITCHEN')
  doneUnit(@Param('id') id: string) { return this.kitchenService.doneUnit(id); }
}
