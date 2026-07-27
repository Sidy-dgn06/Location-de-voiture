import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { HealthModule } from './health/health.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';
import { User } from './users/user.entity';
import { Car } from './cars/car.entity';
import { Reservation } from './reservations/reservation.entity';
import { MetricsMiddleware } from './monitoring/metrics.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CacheModuleOptions => {
        const redisUrl = configService.get<string>('REDIS_URL');
        if (redisUrl) {
          try {
            const redisStore = require('cache-manager-redis-store');
            return { store: redisStore, url: redisUrl, ttl: 60 };
          } catch {
            return { ttl: 60 };
          }
        }
        return { ttl: 60 };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const type = configService.get<string>('DB_TYPE', 'sqlite');
        const common = {
          synchronize: configService.get<string>('TYPEORM_SYNC', 'true') === 'true',
          logging: configService.get<string>('TYPEORM_LOGGING', 'false') === 'true',
          entities: [User, Car, Reservation],
        };

        if (type === 'mysql') {
          return {
            type: 'mysql',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
            username: configService.get<string>('DB_USERNAME', 'root'),
            password: configService.get<string>('DB_PASSWORD', ''),
            database: configService.get<string>('DB_DATABASE', 'locationdevoitures'),
            charset: 'utf8mb4',
            timezone: 'Z',
            ...common,
          };
        }

        return {
          type: 'sqlite',
          database: configService.get<string>('DATABASE_PATH', 'backend/db/locationdevoitures.sqlite'),
          ...common,
        };
      },
    }),
    AuthModule,
    UsersModule,
    CarsModule,
    ReservationsModule,
    WeatherModule,
    MonitoringModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
