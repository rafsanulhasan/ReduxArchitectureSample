import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as states from './todo.states';
import { AppState } from '../app.states';

export const selectTodoFeature = createFeatureSelector<AppState, states.TodoFeatureState>(states.todoStateKey);

export const getTodos = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.todos,
);

export const getTodosLoadingStatus = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.isListLoading,
);

export const getTodosError = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.todoListError,
);

export const getTodo = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.todo,
);

export const getTodoLoadingStatus = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.isItemLoading,
);

export const getTodoError = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.todoItemError,
);

export const getSelectedTodoList = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.selectedList,
);

export const getSelectedTodo = createSelector(
  selectTodoFeature,
  (state: states.TodoFeatureState) => state.selectedTodo,
);

