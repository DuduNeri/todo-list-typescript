import { useState } from 'react';
import './App.css';
import ToDoItem from './TodoItem';
import AudioRecorder from './AudioRecorder';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  file: File | undefined;
  audio: Blob | undefined;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [audio, setAudio] = useState<Blob | null>(null);

  const addTodo = () => {
    if (newTodo.trim() !== '' || file || audio) {
      const newTask: Todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        file: file || undefined,
        audio: audio || undefined,
      };

      setTodos(prevTodos => [...prevTodos, newTask]);
      setNewTodo('');
      setFile(null);
      setAudio(null);
      toast.success("Tarefa adicionada com sucesso!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
    toast.info("Tarefa removida!");
  };

  const startEditing = (id: number, currentText: string) => {
    setIsEditing(id);
    setEditText(currentText);
  };

  const editTodo = (id: number, newTodo: Todo) => {
    setTodos(todos.map(todo =>
      todo.id === id ? newTodo : todo
    ));
    setIsEditing(null);
    setEditText('');
    toast.success("Tarefa editada com sucesso!");
  };

  const handleAudioRecorded = (audioBlob: Blob) => {
    setAudio(audioBlob);
  };

  return (
    <>
      <div className="container">
        <h1>To-Do List</h1>
        <div className="input-container">
          <input
            className="input"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            Escolher Arquivo
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="btn-add" onClick={addTodo}>
            Add
          </button>
        </div>
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
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default App;
