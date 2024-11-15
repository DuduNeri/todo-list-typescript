import { useEffect, useState } from 'react';
import './App.css';
import ToDoItem from './TodoItem';
import AudioRecorder from './AudioRecorder'; 
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  file?: File;
  audio?: Blob; 
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
      const newTask = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        file: file || null,
        audio: audio || null, 
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

  function addTask() {
    const minhalista = localStorage.getItem("TodoItem");
    let taskSalva = JSON.parse(minhalista || '[]');

    const hasFilme = taskSalva.some((task: Todo) => task.id === minhalista?.id);
    if (hasFilme) {
      toast.warn("Esse filme já está na lista!"); 
      return;
    }
    taskSalva.push({ id: Date.now(), text: 'new task' }); 
    localStorage.setItem("TodoItem", JSON.stringify(taskSalva));
    toast.success("Tarefa adicionada com sucesso!");
  }

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
              editTodo={(id, newTodo) => editTodo(id, newTodo)}
            >
              {todo.file && (
                <div className="file-icon">
                  {getFileIcon(todo.file)}
                  <span>{todo.file.name}</span>
                </div>
              )}
              {todo.audio && (
                <audio className="audio" controls>
                  <source src={URL.createObjectURL(todo.audio)} type="audio/wav" />
                </audio>
              )}
            </ToDoItem>
          ))}
        </ul>
      </div>
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );  
};

export default App;
