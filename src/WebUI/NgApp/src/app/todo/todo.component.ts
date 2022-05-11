import { Component, TemplateRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { map, tap, take, filter } from 'rxjs/operators';

import { fetchTodos, addTodo, selectTodoList, selectTodo, removeTodoById, editTodo, createTodo, CreateTodoActionTypes, updateTodo, deleteTodo } from '../store/todo/todo.actions';
import { getTodos, getSelectedTodoList, getSelectedTodo, getTodosLoadingStatus } from '../store/todo/todo.selectors';
import { AppState } from '../store/app.states';

import {
  TodoItemsClient, CreateTodoItemCommand,
  TodoItemDto, UpdateTodoItemCommand,
  TodosVm, TodoListsClient, TodoListDto,
  CreateTodoListCommand, UpdateTodoListCommand,
  UpdateTodoItemDetailCommand,
} from '../web-api-client';

@Component({
    selector: 'app-todo-component',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.scss']
})
export class TodoComponent {

  debug = false;

  vm$: Observable<TodosVm>;
  vm: TodosVm;
  isListLoading$: Observable<boolean>;  

  selectedList$: Observable<TodoListDto>;
  selectedList: TodoListDto;
  selectedItem$: Observable<TodoListDto>;
  selectedItem: TodoItemDto;

  newListEditor: any = {};
  listOptionsEditor: any = {};
  itemDetailsEditor: any = {};

  newListModalRef: BsModalRef;
  listOptionsModalRef: BsModalRef;
  deleteListModalRef: BsModalRef;
  itemDetailsModalRef: BsModalRef;

  faPlus = faPlus;
  faEllipsisH = faEllipsisH;

  constructor(
    private listsClient: TodoListsClient,
    private itemsClient: TodoItemsClient,
    private modalService: BsModalService,
    private store: Store<AppState>,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.store.dispatch(fetchTodos());
    this.vm$ = this.store.pipe(
      map(state => getTodos(state)),
    );
    this.vm$.subscribe(vm => this.vm = vm);
    this.selectedList$ = this.store.pipe(map(state => getSelectedTodoList(state)));
    this.selectedList$.subscribe(l => this.selectedList = l);
    this.selectedItem$ = this.store.pipe(map(state => getSelectedTodo(state)));
    //this.selectedItem$.subscribe(item => this.selectedItem = item);
    this.isListLoading$ = this.store.pipe(map(state => getTodosLoadingStatus(state)));
  }

  // Lists
  remainingItems(list: TodoListDto): number {
      return list.items.filter(t => !t.done).length;
  }

  showNewListModal(template: TemplateRef<any>): void {
      this.newListModalRef = this.modalService.show(template);
      setTimeout(() => document.getElementById("title").focus(), 250);
  }

  newListCancelled(): void {
      this.newListModalRef.hide();
      this.newListEditor = {};
  }

  addList(): void {
      let list = TodoListDto.fromJS({
        id: 0,
        title: this.newListEditor.title,
        items: [],
      });

    this.listsClient.create(<CreateTodoListCommand>{ title: this.newListEditor.title }).subscribe(
        result => {
            list.id = result;
            this.vm.lists.push(list);
            this.selectedList = list;
            this.newListModalRef.hide();
            this.newListEditor = {};
        },
        error => {
            let errors = JSON.parse(error.response);

            if (errors && errors.Title) {
                this.newListEditor.error = errors.Title[0];
            }

            setTimeout(() => document.getElementById("title").focus(), 250);
        }
    );
  }

  showListOptionsModal(template: TemplateRef<any>) {
      this.listOptionsEditor = {
          id: this.selectedList.id,
          title: this.selectedList.title,
      };

      this.listOptionsModalRef = this.modalService.show(template);
  }

  updateListOptions() {
      this.listsClient.update(this.selectedList.id, UpdateTodoListCommand.fromJS(this.listOptionsEditor))
          .subscribe(
              () => {
                  this.selectedList.title = this.listOptionsEditor.title,
                  this.listOptionsModalRef.hide();
                  this.listOptionsEditor = {};
              },
              error => console.error(error)
          );
  }

  confirmDeleteList(template: TemplateRef<any>) {
      this.listOptionsModalRef.hide();
      this.deleteListModalRef = this.modalService.show(template);
  }

  deleteListConfirmed(): void {
      this.listsClient.delete(this.selectedList.id).subscribe(
          () => {
              this.deleteListModalRef.hide();
              this.vm.lists = this.vm.lists.filter(t => t.id != this.selectedList.id)
              this.selectedList = this.vm.lists.length ? this.vm.lists[0] : null;
          },
          error => console.error(error)
      );
  }

  // Items

  showItemDetailsModal(template: TemplateRef<any>, item: TodoItemDto): void {
      this.selectedItem = item;
      this.itemDetailsEditor = {
          ...this.selectedItem
      };

      this.itemDetailsModalRef = this.modalService.show(template);
  }

  updateItemDetails(): void {
      this.itemsClient.updateItemDetails(this.selectedItem.id, UpdateTodoItemDetailCommand.fromJS(this.itemDetailsEditor))
          .subscribe(
              () => {
                  if (this.selectedItem.listId != this.itemDetailsEditor.listId) {
                      this.selectedList.items = this.selectedList.items.filter(i => i.id != this.selectedItem.id)
                      let listIndex = this.vm.lists.findIndex(l => l.id == this.itemDetailsEditor.listId);
                      this.selectedItem.listId = this.itemDetailsEditor.listId;
                      this.vm.lists[listIndex].items.push(this.selectedItem);
                  }

                  this.selectedItem.priority = this.itemDetailsEditor.priority;
                  this.selectedItem.note = this.itemDetailsEditor.note;
                  this.itemDetailsModalRef.hide();
                  this.itemDetailsEditor = {};
              },
              error => console.error(error)
          );
  }

  addItem(item: TodoItemDto = null) {
    item = item === null
         ? TodoItemDto.fromJS({
            id: 0,
            listId: this.selectedList.id,
            priority: this.vm.priorityLevels[0].value,
            title: '',
            done: false,
            note: '',
          })
         : TodoItemDto.fromJS(item);

    if (this.selectedList && this.selectedList.items && Array.isArray(this.selectedList.items)) {
      this.store.dispatch(addTodo({ data: item }));
      let index = this.selectedList.items.length - 1;
      this.editItem(item, 'itemTitle' + index);
    }
  }

  editItem(item: TodoItemDto, inputId: string): void {
    this.selectedItem = item;
    setTimeout(() => {
      let input = <HTMLInputElement>this.document.querySelector(`input[type='text']`);
      if (input) {
        input.focus();
      }
      console.log(input);
    }, 100);
  }

  editTodoItem(item: TodoItemDto, element: HTMLInputElement): void {
    const data = TodoItemDto.fromJS({ ...item, title: element.value });
    this.store.dispatch(editTodo({ data }));
    element.focus();
  }

  updateItem(item: TodoItemDto, pressedEnter: boolean = false): void {
    let isNewItem = item.id === 0;
    this.selectedItem$.pipe(take(1), filter(item => item != null)).subscribe(selectedItem => {
      if (!selectedItem.title || selectedItem.title.trim() === '') {
        this.store.dispatch(removeTodoById({ id: 0 }));
      }

      if (isNewItem) {
        const command = CreateTodoItemCommand.fromJS({ ...selectedItem, listId: this.selectedList.id });        
        this.store.dispatch(createTodo({ data: selectedItem, command: command }));
      } else {
        const command = UpdateTodoItemCommand.fromJS(selectedItem);
        this.store.dispatch(updateTodo({ list: this.selectedList, id: selectedItem.id, command: command }));
      }
    });
  }

  // Delete item
  deleteItem(item: TodoItemDto) {
      if (this.itemDetailsModalRef) {
          this.itemDetailsModalRef.hide();
      }
      this.store.dispatch(deleteTodo({ id: item.id, listId: item.listId }));
  }
}
