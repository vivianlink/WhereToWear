import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Weather} from './weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  static isCurrentDate(date: Date): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return currentDate.getTime() === date.getTime();
  }

  getWeather(lng: number, lat: number, date: Date) {
    if (WeatherService.isCurrentDate(date)) {
      return this.http.get<Weather>(`/api/getCurrentWeather?lng=${lng}&lat=${lat}`);
    } else {
      const unixTimestamp = Math.round(date.getTime() / 1000);
      return this.http.get<Weather>(`/api/getWeatherOf?lng=${lng}&lat=${lat}&date=${unixTimestamp}`);
    }
  }
}
