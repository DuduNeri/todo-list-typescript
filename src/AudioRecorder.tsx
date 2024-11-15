import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioList, setAudioList] = useState<string[]>([]); 
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    setIsRecording(true);
    audioChunksRef.current = [];
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);

          setAudioList((prevList) => [...prevList, audioUrl]);
        };
        
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error accessing audio devices', error);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const deleteAudio = (index: number) => {
    setAudioList((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <div className="audio-recorder">
      <button
        className={`audio-button ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? <FaStop /> : <FaMicrophone />}
      </button>

      <div className="audio-list">
        {audioList.map((audio, index) => (
          <div key={index} className="audio-item">
            <p>Gravação {index + 1}</p>
            <audio className='controls' controls>
              <source src={audio} type="audio/wav" />
            </audio>
            <button
              className="delete-audio-button"
              onClick={() => deleteAudio(index)}
            >
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioRecorder;
