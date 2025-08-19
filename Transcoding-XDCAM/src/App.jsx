import './App.css'
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import VideoDropzone from './components/VideoDropzone';

function App() {

  const [videoFiles, setVideoFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");

  const handleFilesDrop = (acceptedFiles) => {
    const totalFiles = videoFiles.length + acceptedFiles.length;
    if (totalFiles > 3){
      alert("Voce pode selecionar no máximo 3 arquivos.")
      return;
    }
    setVideoFiles(currentFiles => [...currentFiles, ...acceptedFiles]);
  };

  return (
    <>
      <div className='container-principal'>
        <div className='titulo-principal'>
          <h1>TRANSCODING-XDCAM</h1>
        </div>
        <div className='subtitulo'>
          <p>Processar Vídeos</p>
        </div>
        <div className='clipes'>
          <h2>Clipes</h2>
          <VideoDropzone
          onFilesDrop={handleFilesDrop}
          files={videoFiles}
          maxFiles={3}
          />
        </div>
        <div className='arquivos-selecionados'>
          {videoFiles.length > 0 && <h4>Arquivos selecionados: </h4>}
          <ul>
            {videoFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
        <div className='titulo-video'>
          <h2>Título</h2>
          <input
            type='Text'
            className='titulo-video-input'
            placeholder='Titulo do vídeo'
            maxLength={250}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='destino'>
          <h2>Destino</h2>
            <select 
            name="destino" 
            className='select'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            >
              <option value="" disabled>
                Escolha um Destino
              </option>
              <option value="MAM-ION">MAM VIZART ION</option>
              <option value="MAM_SP">MAM VIZRT SP</option>
              <option value="MEDIA_LAKE">MEDIA LAKE</option>
            </select>
        </div>
        <div className='processo'>
          <h2>Processamento: </h2>
          {/* <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box> */}
        </div>
        <div className='botao'>
          <button>Enviar</button>
        </div>
      </div>
    </>
  )
}

export default App
