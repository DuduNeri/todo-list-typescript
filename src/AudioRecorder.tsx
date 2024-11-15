import React, { useState, useRef } from 'react';

const AudioRecorder: React.FC<{ onAudioRecorded: (audioBlob: Blob) => void }> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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
          setAudioUrl(URL.createObjectURL(audioBlob));
          onAudioRecorded(audioBlob);
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

  return (
    <div className='audio'>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
      </button>
      {audioUrl && (
        <div>
          <audio className='audio' controls>
            <source src={audioUrl} type="audio/wav" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
