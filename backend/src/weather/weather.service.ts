import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async getWeather(city: string) {
    const normalizedCity = city.trim().toLowerCase();
    return this.cacheManager.wrap(`weather:${normalizedCity}`, async () => {
      const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
      if (!apiKey) {
        return this.getFallbackWeather(normalizedCity || 'Dakar');
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        normalizedCity,
      )}&units=metric&lang=fr&appid=${apiKey}`;

      try {
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return this.getFallbackWeather(normalizedCity || 'Dakar');
        }
        throw error;
      }
    }, { ttl: 300 });
  }

  private getFallbackWeather(city: string) {
    return {
      name: city[0].toUpperCase() + city.slice(1),
      weather: [
        {
          description: 'Ensoleillé',
          icon: '01d',
        },
      ],
      main: {
        temp: 28,
        humidity: 65,
      },
      wind: {
        speed: 3.5,
      },
    };
  }
}
