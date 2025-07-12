import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Document } from '../documents/document.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const usersService = app.get(UsersService);
    const dataSource = app.get(DataSource);

    console.log('🚀 Seeding started...');

    const roles = ['admin', 'editor', 'viewer'];
    const users: UserResponseDto[] = [];

    const userSize = 1000;
    for (let i = 0; i < userSize; i++) {
        const email = faker.internet.email();
        const password = await bcrypt.hash('password123', 10);
        const name = faker.person.fullName();
        const role = [roles[Math.floor(Math.random() * roles.length)]];

        try {
            const user = await usersService.create({ email, password, name, roles: role });
            users.push(user);
        } catch (error: any) {
            console.error(`❌ Failed to create user ${email}:`, error.message || error);
        }
    }

    console.log(`✅ Created ${users.length} users`);

    // 2. Create 100000 documents in batches
    const BATCH_SIZE = 1000;
    const totalDocs = 100000;

    for (let i = 0; i < totalDocs; i += BATCH_SIZE) {
        const batch: Partial<Document>[] = [];

        for (let j = 0; j < BATCH_SIZE; j++) {
            const title = faker.lorem.sentence();
            const filename = faker.system.fileName();
            const user = users[Math.floor(Math.random() * users.length)];

            batch.push({ title, filename, ownerId: user.id });
        }

        try {
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(Document)
                .values(batch)
                .execute();

            console.log(`✅ Inserted ${Math.min(i + BATCH_SIZE, totalDocs)} documents`);
        } catch (error: any) {
            console.error(`❌ Failed to insert batch starting at ${i}:`, error.message || error);
        }
    }

    console.log('🎉 Seeding complete!');
    await app.close();
}

bootstrap();
