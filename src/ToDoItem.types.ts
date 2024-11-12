import { Todo } from "./App";

export interface ToDoItemProps {
  todo: Todo;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  startEditing: (id: number, currentText: string) => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  editTodo: (id: number, newTodo: Todo) => void;
}
