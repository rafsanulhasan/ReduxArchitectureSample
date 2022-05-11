import { createAction, props } from '@ngrx/store';

import { WeatherForecast } from '../../web-api-client';

const actionPrefix = '[Weather]';

export class FetchWeatherForecastActionTypes {
  public static readonly FetchWeatherForecast = `${actionPrefix} Fetching Data`;
  public static readonly FetchWeatherForecastCompleted = `${actionPrefix} Fetching Data Completed`;
  public static readonly FetchWeatherForecastError = `${actionPrefix} Error Fetching Data`;
}

export const fetchWeatherForecast = createAction(FetchWeatherForecastActionTypes.FetchWeatherForecast);
export const fetchWeatherForecastCompleted = createAction(FetchWeatherForecastActionTypes.FetchWeatherForecastCompleted, props<{ data: WeatherForecast[] }>());
export const fetchWeatherForecastError = createAction(FetchWeatherForecastActionTypes.FetchWeatherForecastError, props<{ error: string }>());
