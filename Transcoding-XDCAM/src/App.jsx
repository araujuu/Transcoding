import './App.css'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import VideoDropzone from './components/VideoDropzone';

function App() {

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
          <VideoDropzone />
        </div>
        <div className='titulo-video'>
          <h2>Título</h2>
          <input
            type='Text'
            className='titulo-video-input'
            placeholder='Titulo do vídeo'
            maxLength={250}
          />
        </div>
        <div className='destino'>
          <h2>Destino</h2>
          <form>
            <select name="destino" className='select'>
              <option value="" disabled selected>
                Escolha um Destino
              </option>
              <option value="MAM-ION">MAM VIZART ION</option>
            </select>
          </form>
        </div>
        <div className='processo'>
          <h2>Processamento: </h2>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
        <div className='botao'>
          <button>Enviar</button>
        </div>
      </div>
    </>
  )
}

export default App
