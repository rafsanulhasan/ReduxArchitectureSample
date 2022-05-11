import { TodoItemDto, TodoListDto, TodosVm, PaginatedListOfTodoItemBriefDto } from '../../web-api-client';

export const todoStateKey = 'todo';

export interface TodoFeatureState {
  todos: TodosVm;
  todo: TodoItemDto;
  selectedList: TodoListDto;
  selectedTodo: TodoItemDto;
  count: number;
  isListLoading: boolean;
  isItemLoading: boolean;
  todoListError?: string;
  todoItemError?: string;
}

export const todoFeatureState: TodoFeatureState = {
  todos: null,
  todo: null,
  selectedList: null,
  selectedTodo: null,
  count: 0,
  isListLoading: true,
  isItemLoading: true,
  todoListError: '',
  todoItemError: '',
};
