import { createAction, props } from '@ngrx/store';

import { TodoListDto, TodoItemDto, TodosVm, TodoItemBriefDto, PaginatedListOfTodoItemBriefDto, CreateTodoItemCommand, UpdateTodoItemCommand } from '../../web-api-client';

const actionPrefix = '[Todo]';

export class FetchTodoActionTypes {
  public static readonly FetchTodos = `${actionPrefix} Fetching Todos`;
  public static readonly FetchTodosCompleted = `${actionPrefix} Fetching Todos Completed`;
  public static readonly FetchTodosError = `${actionPrefix} Error Fetching Todos`;

  public static readonly FetchTodo = `${actionPrefix} Fetching Todo`;
  public static readonly FetchTodoCompleted = `${actionPrefix} Fetching Todo Completed`;
  public static readonly FetchTodoError = `${actionPrefix} Error Fetching Todo`;
}

export class AddTodoActionTypes {
  public static readonly AddTodo = `${actionPrefix} Adding Todo`;
}

export class CreateTodoActionTypes {
  public static readonly CreateTodos = `${actionPrefix} Create Todos`;
  public static readonly CreateTodosCompleted = `${actionPrefix} Creating Todos Completed`;
  public static readonly CreateTodosError = `${actionPrefix} Error Creating Todos`;

  public static readonly CreateTodo = `${actionPrefix} Create Todo`;
  public static readonly CreateTodoCompleted = `${actionPrefix} Creating Todo Completed`;
  public static readonly CreateTodoError = `${actionPrefix} Error Creating Todo`;
}

export class UpdateTodoActionTypes {
  public static readonly UpdateTodos = `${actionPrefix} Updating Todos`;
  public static readonly UpdateTodosCompleted = `${actionPrefix} Updating Todos Completed`;
  public static readonly UpdateTodosError = `${actionPrefix} Error Updating Todos`;

  public static readonly UpdateTodo = `${actionPrefix} Updating Todo`;
  public static readonly UpdateTodoCompleted = `${actionPrefix} Updating Todo Completed`;
  public static readonly UpdateTodoError = `${actionPrefix} Error Updating Todo`;

  public static readonly EditTodo = `${actionPrefix} Editing Todo`;
}

export class DeleteTodoActionTypes {
  public static readonly DeleteTodos = `${actionPrefix} Deleting Todos`;
  public static readonly DeleteTodosCompleted = `${actionPrefix} Deleting Todos Completed`;
  public static readonly DeleteTodosError = `${actionPrefix} Error Deleting Todos`;

  public static readonly DeleteTodo = `${actionPrefix} Deleting Todo`;
  public static readonly DeleteTodoCompleted = `${actionPrefix} Deleting Todo Completed`;
  public static readonly DeleteTodoError = `${actionPrefix} Error Deleting Todo`;
  public static readonly RemoveTodo = `${actionPrefix} Removing Todo`;
}

export class SelectTodoActionTypes {
  public static readonly SelectTodoList = `${actionPrefix} TodoList Selected`;
  public static readonly SelectTodo = `${actionPrefix} Todo Selected`;
}

export const fetchTodos = createAction(FetchTodoActionTypes.FetchTodos);
export const fetchTodosCompleted = createAction(FetchTodoActionTypes.FetchTodosCompleted, props<{ data: TodosVm }>());
export const fetchTodosError = createAction(FetchTodoActionTypes.FetchTodosError, props<{ error: string }>());

//export const fetchTodo = createAction(FetchTodoActionTypes.FetchTodo, props<{ id: number }>());
//export const fetchTodoCompleted = createAction(FetchTodoActionTypes.FetchTodoCompleted, props<{ data: PaginatedListOfTodoItemBriefDto }>());
//export const fetchTodoError = createAction(FetchTodoActionTypes.FetchTodoError, props<{ error: string }>());

//export const createTodos = createAction(CreateTodoActionTypes.CreateTodos);
//export const createTodosCompleted = createAction(CreateTodoActionTypes.CreateTodosCompleted, props<{ data: TodoListDto[] }>());
//export const createTodosError = createAction(CreateTodoActionTypes.CreateTodosError, props<{ error: string }>());

export const addTodo = createAction(AddTodoActionTypes.AddTodo, props<{ data: TodoItemDto }>());

export const createTodo = createAction(CreateTodoActionTypes.CreateTodo, props<{ data: TodoItemDto, command: CreateTodoItemCommand }>());
export const createTodoCompleted = createAction(CreateTodoActionTypes.CreateTodoCompleted, props<{ data: TodoItemDto }>());
export const createTodoError = createAction(CreateTodoActionTypes.CreateTodoError, props<{ error: string }>());

//export const updateTodos = createAction(UpdateTodoActionTypes.UpdateTodos);
//export const updateTodosCompleted = createAction(UpdateTodoActionTypes.UpdateTodosCompleted, props<{ data: TodoListDto[] }>());
//export const updateTodosError = createAction(UpdateTodoActionTypes.UpdateTodosError, props<{ error: string }>());

export const editTodo = createAction(UpdateTodoActionTypes.EditTodo, props<{ data: TodoItemDto }>());

export const updateTodo = createAction(UpdateTodoActionTypes.UpdateTodo, props<{ list: TodoListDto, id:number, command: UpdateTodoItemCommand }>());
export const updateTodoCompleted = createAction(UpdateTodoActionTypes.UpdateTodoCompleted, props<{ index: number, data: TodoItemDto }>());
export const updateTodoError = createAction(UpdateTodoActionTypes.UpdateTodoError, props<{ error: string }>());

//export const deleteTodos = createAction(DeleteTodoActionTypes.DeleteTodos);
//export const deleteTodosCompleted = createAction(DeleteTodoActionTypes.DeleteTodosCompleted, props<{ data: TodoListDto[] }>());
//export const deleteTodosError = createAction(DeleteTodoActionTypes.DeleteTodosError, props<{ error: string }>());

export const removeTodoById = createAction(DeleteTodoActionTypes.RemoveTodo, props<{ id: number }>());

export const deleteTodo = createAction(DeleteTodoActionTypes.DeleteTodo, props<{ id: number, listId: number }>());
export const deleteTodoCompleted = createAction(DeleteTodoActionTypes.DeleteTodoCompleted, props<{ id: number, listId: number }>());
export const deleteTodoError = createAction(DeleteTodoActionTypes.DeleteTodoError, props<{ error: string }>());

export const selectTodoList = createAction(SelectTodoActionTypes.SelectTodoList, props<{ data: TodoListDto }>());
export const selectTodo = createAction(SelectTodoActionTypes.SelectTodo, props<{ data: TodoItemDto }>());

