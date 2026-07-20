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
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_PATH', 'backend/db/locationdevoitures.sqlite'),
        synchronize: configService.get<string>('TYPEORM_SYNC', 'true') === 'true',
        logging: configService.get<string>('TYPEORM_LOGGING', 'false') === 'true',
        entities: [User, Car, Reservation],
      }),
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
