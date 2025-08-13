import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentsController } from './comments.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
