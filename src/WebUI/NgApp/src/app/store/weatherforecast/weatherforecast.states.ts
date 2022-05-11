import { WeatherForecastClient, WeatherForecast } from '../../web-api-client';

export const weatherforecastStateKey = 'weatherForecast';

export interface WeatherForecastFeatureState {
  data: WeatherForecast[];
  count: number;
  isLoading: boolean;
  error?: string;
}

export const weatherForecastFeatureState: WeatherForecastFeatureState = {
  data: [],
  count: 0,
  isLoading: true,
  error: '',
};
