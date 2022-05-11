import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';

import * as actions from './weatherforecast.actions';
import { AppState } from '../app.states';
import { WeatherForecastClient, WeatherForecast } from '../../web-api-client';

@Injectable()
export class FetchWeatherForecastEffect
{
  public fetchData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FetchWeatherForecastActionTypes.FetchWeatherForecast),
      exhaustMap(action =>
        this
          .client
          .get()
          .pipe(
            map((data: WeatherForecast[]) => actions.fetchWeatherForecastCompleted({ data })),
            catchError(error => of(actions.fetchWeatherForecastError({ error }))),
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private client: WeatherForecastClient,
  ) {
  }
}
