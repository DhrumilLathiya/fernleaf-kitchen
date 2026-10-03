import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  /** GET /api/dashboard/metrics - Returns role-specific KPIs */
  @Get('metrics')
  getMetrics(@Request() req: any) {
    return this.dashboardService.getMetrics(req.user.role);
  }
}
