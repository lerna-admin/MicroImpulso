import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './entities/user.module';
import { ClientsModule } from './clients/clients.module';
import { PrismaService } from './prisma/prisma.service';


@Module({
  imports: [UserModule, ClientsModule, PrismaService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
