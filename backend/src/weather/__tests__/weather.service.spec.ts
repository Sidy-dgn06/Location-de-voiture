import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { throwError } from 'rxjs';
import { WeatherService } from '../weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: { get: jest.Mock };
  let cacheManager: { wrap: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    httpService = { get: jest.fn() };
    cacheManager = { wrap: jest.fn((_key, factory) => factory()) };
    configService = { get: jest.fn().mockReturnValue('test-key') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: HttpService, useValue: httpService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('returns fallback weather when the OpenWeather API fails', async () => {
    httpService.get.mockReturnValue(throwError(() => new Error('network down')));

    await expect(service.getWeather('dakar')).resolves.toMatchObject({
      name: 'Dakar',
      weather: [{ description: 'Ensoleillé' }],
      main: { temp: 28, humidity: 65 },
    });
  });
});
