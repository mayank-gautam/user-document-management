import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'editor')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger/:docId')
  async trigger(@Param('docId') docId: string) {
    return this.ingestionService.trigger(+docId);
  }

  @Get('jobs')
  async findAllJobs() {
    return this.ingestionService.findAllJobs();
  }

  @Get('jobs/:id')
  async findOneJob(@Param('id') id: string) {
    return this.ingestionService.findOneJob(+id);
  }
}
