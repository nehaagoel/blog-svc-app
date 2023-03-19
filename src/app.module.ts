import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './modules/auth/local.strategy';
// import { CommentModule } from './modules/Comment/Comment.module';
import { UserModule, BlogModule } from './modules';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import configurations from './config/configurations';

@Module({
  imports: [ MongooseModule.forRoot(configurations.mongo),
    UserModule,
    PassportModule,
    BlogModule,
    // CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy],
})
export class AppModule {}
