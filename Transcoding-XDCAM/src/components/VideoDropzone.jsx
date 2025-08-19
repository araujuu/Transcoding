import React, { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";
import "../App.css";

function VideoDropzone() {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "video/*": [] },
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 3) {
        alert("Você só pode adicionar no máximo 3 arquivos!");
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: isDragActive ? "2px dashed #1976d2" : "2px solid grey",
        borderRadius: "10px",
        backgroundColor: isDragActive ? "#e3f2fd" : "white",
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
        ) : files.length > 0 ? (
          <Box sx={{ mt: 2, width: "100%" }}>
            {files.map((file) => (
              <Box key={file.path || file.name} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {file.path || file.name}
                </Typography>
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    borderRadius: "12px",
                  }}
                />
              </Box>
            ))}
          </Box>
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
