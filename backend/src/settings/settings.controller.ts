import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  /** GET /api/settings */
  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  /** PUT /api/settings - Admin only */
  @Put()
  @Roles('ADMIN')
  updateSettings(@Body() body: any) {
    return this.settingsService.updateSettings(body);
  }
}
