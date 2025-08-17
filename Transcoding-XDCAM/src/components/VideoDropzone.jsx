import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import {useDropzone} from 'react-dropzone'
import "../App.css";

function VideoDropzone() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles); // Aqui você lida com os arquivos selecionados
    },
    accept: {
      // Define que apenas vídeos são aceitos
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: isDragActive ? '2px dashed #1976d2' : "2px solid grey",
        borderRadius: "10px",
        backgroundColor: isDragActive ? '#e3f2fd' : 'white',
        padding: 4,
        textAlign: "center",
        cursor: "pointer",
        transition: "background-color 0.2s, border-color 0.2s",
      }}
    >
     <input {...getInputProps()} /> 

      <Stack spacing={1} alignItems="center">
        <img src="/sgv-upload.svg" alt="sgv" className="upload-img" />
        {isDragActive ? (
          <Typography variant="h6" className="texto-upload">
            Solte o vídeo para adicionar
          </Typography>
        ) : (
          <Typography variant="h6" className="texto-upload">
            Arraste e solte o vídeo aqui
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default VideoDropzone;
