import { useEffect, useState } from 'react';
import './App.css';
import ToDoItem from './TodoItem';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa'; // Adicionando os ícones

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
  const [newFiles, setNewFiles] = useState<File[]>([]); // Adicionando estado para múltiplos arquivos
  
  
  

  const addTodo = () => {
    const newTodos = [...todos];

    // Se tiver texto ou arquivo, adiciona a tarefa
    if (newTodo.trim() !== '' || newFiles.length > 0) {
      newTodos.push({
        id: Date.now(),
        text: newTodo,
        completed: false,
        file: newFiles[newTodos.length] || null, // Adiciona o arquivo se existir
      });

      setTodos(newTodos);
      setNewTodo('');
      setNewFiles([]); // Limpa o estado dos arquivos
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      setNewFiles(prevFiles => {
        const updatedFiles = [...prevFiles];
        updatedFiles[index] = e.target.files[0];
        return updatedFiles;
      });
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
      todo.id === id ?  newTodo  : todo
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
        return <FaFileAlt />; // Ícone genérico para outros tipos de arquivo
    }
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
          onChange={(e) => handleFileChange(e, todos.length)}
          style={{ display: 'none' }}
        />
        <button  className="btn-add" onClick={addTodo}>
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo, index) => (
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
            {/* Exibindo o ícone do arquivo, se houver */}
            {todo.file && (
              <div className="file-icon">
                {getFileIcon(todo.file)}
                <span>{todo.file.name}</span>
              </div>
            )}
          </ToDoItem>
        ))}
      </ul>
    </div>
  );
};

export default App;
