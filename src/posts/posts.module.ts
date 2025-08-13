import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { LikesModule } from 'src/likes/likes.module';

@Module({
  imports: [PrismaModule, AuthModule, LikesModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
