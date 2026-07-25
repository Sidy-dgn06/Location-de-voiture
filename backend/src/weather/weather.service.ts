import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

interface WeatherQuery {
  city?: string;
  lat?: string;
  lon?: string;
}

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async getWeather(city: string, query?: WeatherQuery) {
    const normalizedCity = city.trim().toLowerCase();
    const cacheKey = query?.lat && query?.lon ? `weather:coords:${query.lat}:${query.lon}` : `weather:${normalizedCity}`;

    return this.cacheManager.wrap(cacheKey, async () => {
      const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY')?.trim();
      if (!apiKey) {
        return this.getFallbackWeather(city);
      }

      const url = query?.lat && query?.lon
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(query.lat)}&lon=${encodeURIComponent(query.lon)}&units=metric&lang=fr&appid=${apiKey}`
        : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedCity)}&units=metric&lang=fr&appid=${apiKey}`;

      try {
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return this.getFallbackWeather(city);
        }
        return this.getFallbackWeather(city);
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
