import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentsController } from './comments.controller';

@Module({
  imports: [PrismaModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
