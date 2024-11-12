import { useState } from 'react';
import './App.css';
import ToDoItem from './TodoItem';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  file?: File;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false, file }]);
      setNewTodo('');
      setFile(null); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: number, currentText: string) => {
    setIsEditing(id);
    setEditText(currentText);
  };

  const editTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setIsEditing(null);
    setEditText('');
  };

  return (
    <div className='container'>
      <h1>To-Do List</h1>
      <input
        className='input'
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
     <input 
      id="file-upload" 
      type="file" 
      onChange={handleFileChange} 
      style={{ display: 'none' }} 
     />
     <label htmlFor="file-upload" className="custom-file-upload">
      Escolher Arquivo
     </label>
      <button className='btn-add' onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <ToDoItem
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            startEditing={startEditing}
            isEditing={isEditing === todo.id}
            editText={editText}
            setEditText={setEditText}
            editTodo={editTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
