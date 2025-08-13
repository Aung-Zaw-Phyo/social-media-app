import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
