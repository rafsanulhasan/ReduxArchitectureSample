import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { WeatherForecast } from '../web-api-client';
import { AppState } from '../store/app.states';
import { fetchWeatherForecast } from '../store/weatherforecast/weatherforecast.actions';
import { getWeatherForecast, getWeatherForecastLoadingStatus, getWeatherForecastError } from '../store/weatherforecast/weatherforecast.selectors';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts$: Observable<WeatherForecast[]>;
  public isLoading$: Observable<boolean>;
  public error$: Observable<string>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.store.dispatch(fetchWeatherForecast());
    this.forecasts$ = this.store.pipe(map(state => getWeatherForecast(state)));
    this.isLoading$ = this.store.pipe(map(state => getWeatherForecastLoadingStatus(state)));
    this.error$ = this.store.pipe(map(state => getWeatherForecastError(state)));
  }
}
