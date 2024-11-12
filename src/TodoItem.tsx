import React from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  file?: File;
}

interface ToDoItemProps {
  todo: Todo;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  startEditing: (id: number, currentText: string) => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  editTodo: (id: number) => void;
}

const ToDoItem: React.FC<ToDoItemProps> = ({
  todo,
  toggleComplete,
  deleteTodo,
  startEditing,
  isEditing,
  editText,
  setEditText,
  editTodo,
}) => {
  const fileUrl = todo.file ? URL.createObjectURL(todo.file) : null;

  return (
    <li className='list' style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {isEditing ? (
        <input
          className='input'
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && editTodo(todo.id)}
        />
      ) : (
        <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
      )}
      {fileUrl && (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img src={fileUrl} alt="Attachment preview" style={{ width: '50px', height: '50px', margin: '0 10px' }} />
        </a>
      )}
      {isEditing ? (
        <button className='btn-edit' onClick={() => editTodo(todo.id)}>Save</button>
      ) : (
        <button className='btn-edit' onClick={() => startEditing(todo.id, todo.text)}>Edit</button>
      )}
      <button className='btn-delete' onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
};

export default ToDoItem;
