import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, exhaustMap, catchError } from 'rxjs/operators';

import * as actions from './todo.actions';
import { AppState } from '../app.states';
import {
  TodoListsClient,
  TodoItemsClient,
  TodoListDto,
  TodoItemDto,
  TodosVm,
  PaginatedListOfTodoItemBriefDto,
  CreateTodoItemCommand,
  UpdateTodoItemCommand,
} from '../../web-api-client';

@Injectable()
export class FetchTodosEffect
{
  public fetchData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FetchTodoActionTypes.FetchTodos),
      exhaustMap(action =>
        this
          .client
          .get()
          .pipe(
            mergeMap(data => {
              const actionList = [actions.fetchTodosCompleted({ data })];
              if (data && data.lists && data.lists.length > 0) {
                actionList.push(actions.selectTodoList({ data: data.lists[0] }));
              }
              return actionList;
            }),
            catchError(error => of(actions.fetchTodosError({ error }))),
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private client: TodoListsClient,
  ) {
  }
}

@Injectable()
export class CreateTodoEffect {
  public createTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType<{ type: string, data: TodoItemDto, command: CreateTodoItemCommand }>(actions.CreateTodoActionTypes.CreateTodo),
      exhaustMap((action: { data: TodoItemDto, command: CreateTodoItemCommand }) =>
        this
          .client
          .create(action.command)
          .pipe(
            mergeMap(result => {
              const data = TodoItemDto.fromJS(action.data);
              data.listId = action.command.listId;
              data.id = result;
              data.title = action.command.title;
              const actionList = [
                actions.createTodoCompleted({ data }),
                actions.removeTodoById({ id: 0 })
              ];

              return actionList;
            }),
            catchError(error => of(actions.createTodoError({ error }))),
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private client: TodoItemsClient,
  ) {
  }
}

@Injectable()
export class UpdateTodoEffect {
  public updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType<{ type: string, list: TodoListDto, id: number, command: UpdateTodoItemCommand }>(actions.UpdateTodoActionTypes.UpdateTodo),
      exhaustMap((action: { list: TodoListDto, id: number, command: UpdateTodoItemCommand }) =>
        this
          .client
          .update(action.id, action.command)
          .pipe(
            mergeMap(() => {
              const index = action.list.items.map(item => item.id).indexOf(action.id);
              const data = TodoItemDto.fromJS(action.command);
              const actionList = [
                actions.updateTodoCompleted({ index, data }),
              ];

              return actionList;
            }),
            catchError(error => of(actions.updateTodoError({ error }))),
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private client: TodoItemsClient,
  ) {
  }
}

@Injectable()
export class DeleteTodoEffect {
  public deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType<{ type: string, id: number, listId: number }>(actions.DeleteTodoActionTypes.DeleteTodo),
      exhaustMap((action: { id: number, listId: number }) =>
        this
          .client
          .delete(action.id)
          .pipe(
            mergeMap(() => {              
              const actionList = [
                actions.deleteTodoCompleted(action),
                actions.removeTodoById({ id: action.id }),
              ];

              return actionList;
            }),
            catchError(error => of(actions.deleteTodoError({ error }))),
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private client: TodoItemsClient,
  ) {
  }
}
