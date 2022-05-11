import { createReducer, on } from '@ngrx/store';

import * as states from './counter.states';
import * as actions from './counter.actions';

export const counterReducer = createReducer(
  states.initialCounterState,
  on(actions.increment, (state: states.CounterFeatureState) => ({ ...state, count: state.count + 1 })),
  on(actions.incrementBy, (state: states.CounterFeatureState, action: { by: number }) => ({ ...state, count: state.count + action.by })),
  on(actions.decrement, (state: states.CounterFeatureState) => ({ ...state, count: state.count - 1 })),
  on(actions.decrementBy, (state: states.CounterFeatureState, action: { by: number }) => ({ ...state, count: state.count - action.by })),
  on(actions.reset, (state: states.CounterFeatureState) => ({ ...state, count: 0 })),
);
