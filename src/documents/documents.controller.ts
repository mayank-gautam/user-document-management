import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'editor')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post()
  async create(@Body('title') title: string, @Req() req: Request) {
    const user = req.user as { id?: number };

    if (!user?.id) {
      throw new UnauthorizedException('User ID missing from request');
    }

    return this.documentsService.create(title, 'pending', user.id);
  }

  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${unique}${ext}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.documentsService.update(+id, file.filename);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('title') title: string) {
    return this.documentsService.update(+id, title);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.documentsService.delete(+id);
  }
}
