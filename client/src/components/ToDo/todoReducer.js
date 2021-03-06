import { FETCH_TODOS, ADDED_TODO, DELETED_TODO } from '../../helpers/constants/types';

export default (state = { fetchTodos: [] }, action) => {
  switch (action.type) {
    case FETCH_TODOS:
      return { ...state, fetchTodos: action.payload };
    case ADDED_TODO:
      let holder = state.fetchTodos.slice();
      holder.push(action.payload)
      return { ...state, fetchTodos: holder };
    case DELETED_TODO:
      let update = state.fetchTodos.filter(todo => todo.todo_id !== action.payload.todo_id);
      return { ...state, fetchTodos: update };
  }
  return state;
}

export const getTodos = state => state.todo.fetchTodos; 
export const getLastFiveTodos = state => getTodos(state).slice(-5).reverse();