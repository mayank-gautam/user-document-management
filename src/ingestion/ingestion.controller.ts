import {
  Controller,
  Post,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Ingestion')
@ApiBearerAuth()
@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'editor')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger/:docId')
  @ApiOperation({ summary: 'Trigger ingestion job for a document' })
  @ApiParam({ name: 'docId', type: 'string', description: 'ID of the document' })
  @ApiResponse({ status: 201, description: 'Ingestion job triggered successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async trigger(@Param('docId') docId: string) {
    return this.ingestionService.trigger(+docId);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'List all ingestion jobs' })
  @ApiResponse({ status: 200, description: 'All ingestion jobs fetched' })
  async findAllJobs() {
    return this.ingestionService.findAllJobs();
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get a specific ingestion job by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Ingestion job details returned' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async findOneJob(@Param('id') id: string) {
    return this.ingestionService.findOneJob(+id);
  }
}
