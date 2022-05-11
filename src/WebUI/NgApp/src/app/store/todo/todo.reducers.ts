import { createReducer, on } from '@ngrx/store';

import { TodoFeatureState, todoFeatureState } from './todo.states';
import * as actions from './todo.actions';
import { TodoItemDto, TodoListDto, TodosVm, PaginatedListOfTodoItemBriefDto } from '../../web-api-client';

export const todoReducer = createReducer(
  todoFeatureState,
  on(actions.selectTodoList, (state: TodoFeatureState, action: { data: TodoListDto }) => ({ ...state, selectedList: action.data })),
  on(actions.selectTodo, (state: TodoFeatureState, action: { data: TodoItemDto }) => ({ ...state, selectedTodo: action.data })),

  on(actions.fetchTodosCompleted, (state: TodoFeatureState, action: { data: TodosVm }) => ({ ...state, todos: action.data, count: action.data.lists.length, isListLoading: false })),
  on(actions.fetchTodosError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoListError: action.error, isListLoading: false })),
  //on(actions.fetchTodoCompleted, (state: TodoFeatureState, action: { data: PaginatedListOfTodoItemBriefDto }) => ({ ...state, todoItems: action.data, isItemLoading: false })),
  //on(actions.fetchTodoError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoItemError: action.error, isItemLoading: false })),

  on(
    actions.addTodo,
    (state: TodoFeatureState, action: { data: TodoItemDto }) => {
      const selectedList = TodoListDto.fromJS(state.selectedList);
      const selectedTodo = TodoItemDto.fromJS(action.data);
      selectedList.items.push(selectedTodo);
      return ({ ...state, selectedList, selectedTodo });
    }
  ),

  //on(actions.createTodosCompleted, (state: TodoFeatureState, action: { data: TodoListDto[] }) => ({ ...state, todos: { ...state.todos, lists: [ ...state.todos.lists, ...action.data ] }, count: state.todos.lists.length + action.data.length, selectedTodo: action.data[0], isListLoading: false })),
  //on(actions.createTodosError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoListError: action.error, isListLoading: false })),
  on(
    actions.createTodoCompleted,
    (state: TodoFeatureState, action: { data: TodoItemDto }) => {
      const selectedList = TodoListDto.fromJS(state.selectedList);
      const selectedItem = TodoItemDto.fromJS(action.data);
      selectedList.items.push(selectedItem);
      return ({ ...state, selectedList, selectedItem: null, isItemLoading: false });
    }
  ),
  on(actions.createTodoError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoItemError: action.error, isItemLoading: false })),

  //on(actions.updateTodosCompleted, (state: TodoFeatureState, action: { data: TodoListDto[] }) => ({ ...state, todos: [ ...state.todos.lists.filter(t => !action.data.map(updatedTodo => updatedTodo.id).includes(t.id)), ...action.data ], todo: action.data.map(t => t.id).includes(state.todo.id) ? action.data.find(t => t.id === state.todo.id) : state.todo, selectedTodo: action.data.map(t => t.id).includes(state.selectedTodo.id) ? action.data.find(t => t.id === state.selectedTodo.id) : state.selectedTodo, isListLoading: false })),
  //on(actions.updateTodosError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoListError: action.error, isListLoading: false })),
  on(actions.updateTodoCompleted, (state: TodoFeatureState, action: { index: number, data: TodoItemDto }) => {
    const selectedList = state.selectedList;
    selectedList.items.forEach((item, i) => {
      if (i === action.index) {
        item = action.data;
      }
    });
    return ({ ...state, selectedList: selectedList, selectedTodo: null, isItemLoading: false });
  }),
  on(actions.updateTodoError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoItemError: action.error, isItemLoading: false })),

  on(actions.editTodo, (state: TodoFeatureState, action: { data: TodoItemDto }) => ({ ...state, selectedTodo: TodoItemDto.fromJS(action.data) })),

  //on(actions.deleteTodosCompleted, (state: TodoFeatureState, action: { data: TodoListDto[] }) => ({ ...state, todos: [ ...state.todos.lists.filter(t => !action.data.map(deletedTodo => deletedTodo.id).includes(t.id))], todo: action.data.map(t => t.id).includes(state.todo.id) ? null : state.todo, selectedTodo: action.data.map(t => t.id).includes(state.selectedTodo.id) ? null : state.selectedTodo, count: state.todos.lists.length - action.data.length, isListLoading: false })),
  //on(actions.deleteTodosError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoListError: action.error, isListLoading: false })),
  on(actions.deleteTodoCompleted, (state: TodoFeatureState, action: { id: number, listId: number }) => {
    const todos = TodosVm.fromJS(state.todos);
    const list = todos.lists.find(l => l.id === action.listId);
    list.items = list.items.filter(i => i.id !== action.id);
    return ({ ...state, todos });
  }),
  on(actions.deleteTodoError, (state: TodoFeatureState, action: { error: string }) => ({ ...state, todoItemError: action.error, isItemLoading: false })),

  on(actions.removeTodoById, (state: TodoFeatureState, action: { id: number }) => ({ ...state, selectedList: TodoListDto.fromJS({ ...state.selectedList, items: state.selectedList.items.filter(t => t.id !== action.id).map(t => TodoItemDto.fromJS(t)) }) })),
);
