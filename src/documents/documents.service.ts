import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,
  ) {}

  async create(title: string, filename: string, userId: number) {
    const doc = this.docRepo.create({ title, filename, ownerId: userId });
    return this.docRepo.save(doc);
  }

  async findAll() {
    return this.docRepo.find({ relations: ['owner'] });
  }

  async findById(id: number) {
    const doc = await this.docRepo.findOne({ where: { id }, relations: ['owner'] });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: number, title: string) {
    const doc = await this.findById(id);
    doc.title = title;
    return this.docRepo.save(doc);
  }

  async delete(id: number) {
    return this.docRepo.delete(id);
  }
}
