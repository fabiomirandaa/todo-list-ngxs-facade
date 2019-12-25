import {
  State,
  Action,
  StateContext,
  Selector
} from '@ngxs/store';
import { Todo } from '../models/Todo';
import { TodoActions } from '../actions/todo.action';
import { TodoService } from '../todo.service';
import { tap } from 'rxjs/operators';

export class TodoStateModel {
  todos: Todo[];
  selectedTodo: Todo;
}

@State<TodoStateModel>({
  name: 'todos',
  defaults: {
    todos: [],
    selectedTodo: null
  }
})
export class TodoState {

  constructor(private todoService: TodoService) {
  }

  @Selector()
  static getTodoList(state: TodoStateModel) {
    return state.todos;
  }

  @Selector()
  static getSelectedTodo(state: TodoStateModel) {
    return state.selectedTodo;
  }

  @Action(TodoActions.Get)
  getTodos({ getState, setState }: StateContext<TodoStateModel>) {
    return this.todoService.fetchTodos()
      .pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          todos: result,
        });
      }));
  }

  @Action(TodoActions.Add)
  addTodo({ getState, patchState }: StateContext<TodoStateModel>, { payload }: TodoActions.Add) {
    return this.todoService.addTodo(payload)
      .pipe(tap((result) => {
        const state = getState();
        patchState({
          todos: [...state.todos, result]
        });
      }));
  }

  @Action(TodoActions.Update)
  updateTodo(ctx: StateContext<TodoStateModel>, { payload, id }: TodoActions.Update) {
    return this.todoService.updateTodo(payload, id)
      .pipe(
        tap((result) => {
          console.log(result);
          const state = ctx.getState();
          const todoList = [...state.todos];
          const todoIndex = todoList.findIndex((item) => item.id === id);
          todoList[todoIndex] = result;
          ctx.setState({
            ...state,
            todos: todoList,
          });
        })
      );
  }


  @Action(TodoActions.Delete)
  deleteTodo({ getState, setState }: StateContext<TodoStateModel>, { id }: TodoActions.Delete) {
    return this.todoService.deleteTodo(id)
      .pipe(tap(() => {
        const state = getState();
        const filteredArray = state.todos.filter((item) => item.id !== id);
        setState({
          ...state,
          todos: filteredArray,
        });
      }));
  }

  @Action(TodoActions.SetSelected)
  setSelectedTodoId({ getState, setState }: StateContext<TodoStateModel>, { payload }: TodoActions.SetSelected) {
    const state = getState();
    setState({
      ...state,
      selectedTodo: payload
    });
  }
}
