// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { UsersService } from '../users/users.service';
// import { DocumentsService } from '../documents/documents.service';
// import { DataSource } from 'typeorm';
// import { faker } from '@faker-js/faker';
// import * as bcrypt from 'bcrypt';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);

//   const usersService = app.get(UsersService);
//   const documentsService = app.get(DocumentsService);
//   const dataSource = app.get(DataSource);

//   console.log('🚀 Seeding started...');

//   const roles = ['admin', 'editor', 'viewer'];//   const users = [];

//   // 1. Create 1000 users
//   for (let i = 0; i < 1000; i++) {
//     const email = faker.internet.email();
//     const password = await bcrypt.hash('password123', 10);
//     const name = faker.person.fullName();
//     const role = [roles[Math.floor(Math.random() * roles.length)]];

//     const user = await usersService.create({ email, password, name, roles: role });
//     users.push(user);
//   }

//   console.log(`✅ Created ${users.length} users`);

//   // 2. Create 100000 documents
//   const BATCH_SIZE = 1000;
//   const totalDocs = 100000;

//   for (let i = 0; i < totalDocs; i += BATCH_SIZE) {
//     const batch = [];

//     for (let j = 0; j < BATCH_SIZE; j++) {
//       const title = faker.lorem.sentence();
//       const filename = faker.system.fileName();
//       const user = users[Math.floor(Math.random() * users.length)];

//       batch.push({ title, filename, ownerId: user.id });
//     }

//     await dataSource
//       .createQueryBuilder()
//       .insert()
//       .into('document')
//       .values(batch)
//       .execute();

//     console.log(`✅ Inserted ${i + BATCH_SIZE} documents`);
//   }

//   console.log('🎉 Seeding complete!');
//   await app.close();
// }
// bootstrap();
