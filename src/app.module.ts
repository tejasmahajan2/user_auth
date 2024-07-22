import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'postgres',
      password: 'root',
      database: 'postgres',
      entities: [],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
