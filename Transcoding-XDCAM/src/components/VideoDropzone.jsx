import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";
import "../App.css";

function VideoDropzone({onFilesDrop, files, maxFiles}) {
  
  const fileLimit = files.length >= maxFiles;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv"]
    },
    disabled: fileLimit,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: isDragActive ? "2px dashed #1976d2" : "2px solid grey",
        borderRadius: "10px",
        backgroundColor: fileLimit ? "#f1f1f1": (isDragActive ? "#e3f2fd" : "white"),
        padding: 4,
        textAlign: "center",
        cursor: fileLimit ? 'not-allowed' : "pointer",
        transition: "background-color 0.2s, border-color 0.2s",
        opacity: fileLimit ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} />

      <Stack spacing={1} alignItems="center">
        {fileLimit ? (
          <Typography variant="h6" className="texto-upload">
            Numero máximo de arquivos atingido
          </Typography>
        ) : (
          <>
            <img src="/sgv-upload.svg" alt="sgv" className="upload-img" />
            {isDragActive ? (
              <Typography variant="h6" className="texto-upload">
                Solte os vídeos para adicionar
              </Typography>
            ) : (
              <Typography variant="h6" className="texto-upload">
                Arraste e solte os vídeos aqui
              </Typography>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}

export default VideoDropzone;
