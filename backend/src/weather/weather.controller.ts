import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Query('city') city = 'Dakar',
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
  ) {
    return this.weatherService.getWeather(city, { city, lat, lon });
  }
}
