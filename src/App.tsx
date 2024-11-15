import { useEffect, useState } from 'react';
import './App.css';
import ToDoItem from './TodoItem';
import AudioRecorder from './AudioRecorder'; // Importando o gravador de áudio
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa'; 

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  file?: File;
  audio?: Blob; // Novo campo para armazenar o áudio
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null); 
  const [audio, setAudio] = useState<Blob | null>(null); // Estado para o áudio

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error("Failed to parse todos from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== '' || file || audio) {
      const newTask = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        file: file || null,
        audio: audio || null, // Incluindo o áudio no todo
      };

      setTodos(prevTodos => [...prevTodos, newTask]);
      setNewTodo('');
      setFile(null);
      setAudio(null); // Limpando o áudio após adicionar a tarefa
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
  };

  const getFileIcon = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    switch (fileExtension) {
      case 'pdf':
        return <FaFilePdf />;
      case 'doc':
      case 'docx':
        return <FaFileWord />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel />;
      default:
        return <FaFileAlt />;
    }
  };

  const handleAudioRecorded = (audioBlob: Blob) => {
    setAudio(audioBlob);
  };

  return (
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
        <AudioRecorder onAudioRecorded={handleAudioRecorded} />
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
            editTodo={(id, newTodo) => editTodo(id, newTodo)}
          >
            {todo.file && (
              <div className="file-icon">
                {getFileIcon(todo.file)}
                <span>{todo.file.name}</span>
              </div>
            )}
            {todo.audio && (
              <audio className='audio' controls>
                <source src={URL.createObjectURL(todo.audio)} type="audio/wav" />
              </audio>
            )}
          </ToDoItem>
        ))}
      </ul>
    </div>
  );
};

export default App;
