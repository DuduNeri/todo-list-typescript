import React, { useState, useRef } from 'react';
import { FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAudio } from 'react-icons/fa';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  file: File | undefined;
  audio: Blob | undefined;
}

interface ToDoItemProps {
  todo: Todo;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  startEditing: (id: number, currentText: string) => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  editTodo: (id: number, newTodo: Todo) => void;
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
  const [fileUrl, setFileUrl] = useState<string | undefined>(todo.file ? URL.createObjectURL(todo.file) : undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setFileUrl(URL.createObjectURL(newFile));
      editTodo(todo.id, { ...todo, file: newFile });
    }
  };

  const handleEditFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (fileName: string) => {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    let icon = <FaFileAlt />;

    switch (fileExtension) {
      case 'pdf':
        icon = <FaFilePdf />;
        break;
      case 'doc':
      case 'docx':
        icon = <FaFileWord />;
        break;
      case 'xls':
      case 'xlsx':
        icon = <FaFileExcel />;
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
        icon = <FaFileImage />;
        break;
      case 'mp3':
      case 'wav':
      case 'ogg':
        icon = <FaFileAudio />;
        break;
    }
    return icon;
  };

  return (
    <li className="list">
      <div
        className="task-content"
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          display: 'flex',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {isEditing ? (
          <input
            className="input-edit"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && editTodo(todo.id, { ...todo, text: editText })}
          />
        ) : (
          <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
        )}

        {todo.file ? (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {getFileIcon(todo.file.name)}
              <span>{todo.file.name}</span>
            </a>

            {isEditing && (
              <label
                htmlFor="edit-file-upload"
                className="custom-file-upload"
                onClick={handleEditFileClick}
                style={{ marginLeft: '5px' }}
              >
                Trocar Arquivo
              </label>
            )}
          </div>
        ) : (
          isEditing && (
            <label htmlFor="edit-file-upload" className="custom-file-upload">
              Adicionar Arquivo
            </label>
          )
        )}
      </div>

      <input
        type="file"
        id="edit-file-upload"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <div className="edit-buttons">
        {isEditing ? (
          <button className="btn-edit" onClick={() => editTodo(todo.id, { ...todo, text: editText })}>
            Save
          </button>
        ) : (
          <button className="btn-edit" onClick={() => startEditing(todo.id, todo.text)}>
            Edit
          </button>
        )}
        <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default ToDoItem;
