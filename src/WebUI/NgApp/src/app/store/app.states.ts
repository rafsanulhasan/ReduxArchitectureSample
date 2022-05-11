import { RouterReducerState } from '@ngrx/router-store';

import { CounterFeatureState } from './counter/counter.states';
import { WeatherForecastFeatureState } from './weatherforecast/weatherforecast.states';
import { TodoFeatureState } from './todo/todo.states';

export interface AppState
{
  counter: CounterFeatureState;
  weatherForecast: WeatherForecastFeatureState;
  todo: TodoFeatureState,
}

export const initialAppState: AppState = {
  counter: <CounterFeatureState>{ count: 0 },
  weatherForecast: <WeatherForecastFeatureState>{ data: [], isLoading: true, error: '' },
  todo: <TodoFeatureState> {
    todos: null,
    todo: null,
    selectedList: null,
    selectedTodo: null,
    count: 0,
    isListLoading: true,
    isItemLoading: true,
    todoListError: '',
    todoItemError: '',
  },
}

