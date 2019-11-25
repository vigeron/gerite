import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { logger } from './common/middlewares/logger.middleware';
// import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as appConstants from './common/constants';
import { AuthModule } from './modules/auth/auth.module';
import { BoardsModule } from './modules/boards/boards.module';
import { ListsModule } from './modules/lists/lists.module';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: appConstants.DB_URI,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    UsersModule,
    AuthModule,
    BoardsModule,
    ListsModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // providers: [AppService, UsersService, AuthService, LocalStrategy],

})
export class AppModule implements NestModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer): void {
  // consumer.apply(logger).forRoutes(UsersController);
  // consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}