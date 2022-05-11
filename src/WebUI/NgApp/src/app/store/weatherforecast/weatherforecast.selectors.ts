import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as states from './weatherforecast.states';
import { AppState } from '../app.states';

export const selectWeatherForecastFeature = createFeatureSelector<AppState, states.WeatherForecastFeatureState>(states.weatherforecastStateKey);

export const getWeatherForecast = createSelector(
  selectWeatherForecastFeature,
  (state: states.WeatherForecastFeatureState) => state.data,
);

export const getWeatherForecastLoadingStatus = createSelector(
  selectWeatherForecastFeature,
  (state: states.WeatherForecastFeatureState) => state.isLoading,
);

export const getWeatherForecastError = createSelector(
  selectWeatherForecastFeature,
  (state: states.WeatherForecastFeatureState) => state.error,
);

