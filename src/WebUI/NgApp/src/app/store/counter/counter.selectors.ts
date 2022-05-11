import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as states from './counter.states';
import { AppState } from '../app.states';

export const selectCounterFeature = createFeatureSelector<AppState, states.CounterFeatureState>(states.counterStateKey);

export const getCount = createSelector(
  selectCounterFeature,
  (state: states.CounterFeatureState) => state?.count || 0,
);
