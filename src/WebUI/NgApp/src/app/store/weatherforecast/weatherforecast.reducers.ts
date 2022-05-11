import { createReducer, on } from '@ngrx/store';

import { WeatherForecastFeatureState, weatherForecastFeatureState } from './weatherforecast.states';
import * as actions from './weatherforecast.actions';
import { WeatherForecast } from '../../web-api-client';

export const weatherForecastReducer = createReducer(
  weatherForecastFeatureState,
  on(actions.fetchWeatherForecastCompleted, (state: WeatherForecastFeatureState, action: { data: WeatherForecast[] }) => ({ ...state, data: action.data, count: action.data.length, isLoading: false })),
  on(actions.fetchWeatherForecastError, (state: WeatherForecastFeatureState, action: { error: string }) => ({ ...state, error: action.error, isLoading: false })),
);
