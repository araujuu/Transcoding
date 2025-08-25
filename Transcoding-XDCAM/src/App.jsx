/// importações

import { useState, useEffect } from "react";
import "./App.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import VideoDropzone from "./components/VideoDropzone";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {
  /// Lista de videos, titulo, destino, processamento video - parado(idle), em andamento, sucesso e erro
  const [videoFiles, setVideoFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("idle");

  /// para cada vídeo cria um objeto com id, o arquivo e uma url para mostrar o video na tela
  const toClipItems = (files) =>
    files.map((file) => ({
      id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

  /// adicionar arquivo (limite no max 3) e adiciona os arquivos novos na lista
  const handleFilesDrop = (acceptedFiles) => {
    const totalFiles = videoFiles.length + acceptedFiles.length;
    if (totalFiles > 3) {
      alert("Você pode selecionar no máximo 3 arquivos.");
      return;
    }
    setVideoFiles((curr) => [...curr, ...toClipItems(acceptedFiles)]);
  };

  /// remove um video da lista quando o usuario clica "remover"
  /// libera uma url temporaria para nao ocupar memoria e mostrar o video
  const handleRemoveFile = (id) => {
    setVideoFiles((curr) => {
      const item = curr.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return curr.filter((x) => x.id !== id);
    });
  };
  /// quando a lista é fechada ou o video muda, libera as url's temporarias
  useEffect(() => {
    return () => videoFiles.forEach((v) => URL.revokeObjectURL(v.previewUrl));
  }, [videoFiles]);

  /// garante que o titulo nao tenha caracteres especiais
  const handleTitleChange = (e) => {
    const sanitized = e.target.value.replace(
      /[%+´`@¨&*#!$()??><çÇ"|:>;~^{-]/g,
      ""
    );
    setTitle(sanitized);
  };

  /// reordena os videos e atualiza sua posição atual
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(videoFiles);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setVideoFiles(items);
  };

  /// valida se o usuario adicionou titulo, video e destino
  /// prepara os dados para enviar para o back-end (app.py)
  /// e atualiza o estado para mostrar se deu certo ou algum erro
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (videoFiles.length === 0)
      return alert("Por favor, selecione pelo menos um clipe");
    if (!title.trim()) return alert("Por favor, preencha o título!");
    if (!destination) return alert("Por favor, selecione um destino!");

    setIsProcessing(true);
    setProcessingStatus("in_progress");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("destination", destination);
    videoFiles.forEach(({ file }) => formData.append("files", file));

    try {
      const response = await fetch("http://127.0.0.1:5000/processar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao processar");

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      setProcessingStatus("success");
    } catch (error) {
      console.error("Erro no envio:", error);
      setProcessingStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  /// formulário, drag and drop, titulo, destino, status de processamento e botão de enviar
  return (
    <>
      <form className="container-principal" onSubmit={handleSubmit}>
        <div className="titulo-principal">
          <h1>TRANSCODING-XDCAM</h1>
        </div>

        <div className="subtitulo">
          <p>Processar Vídeos</p>
        </div>
        <div className="clipes">
          <h2>Clipes</h2>
          <VideoDropzone
            onFilesDrop={handleFilesDrop}
            files={videoFiles.map((v) => v.file)}
            maxFiles={3}
          />
        </div>
        <div className="arquivos-selecionados">
          {videoFiles.length > 0 && (
            <h4>Arquivos Selecionados (arraste para reordenar):</h4>
          )}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="videoFiles">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    listStyle: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  {videoFiles.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-item"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            background: "#f9f9f9",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <span>{item.file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(item.id)}
                            className="botao-remove"
                          >
                            Remover
                          </button>
                          <video
                            src={item.previewUrl}
                            controls
                            width="300"
                            style={{ borderRadius: "8px" }}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="titulo-video">
          <h2>Título</h2>
          <input
            type="text"
            className="titulo-video-input"
            placeholder="Título do vídeo"
            maxLength={250}
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="destino">
          <h2>Destino</h2>
          <select
            name="destino"
            className="select"
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
        <div className="processo">
          <h2>Processamento:</h2>
          {processingStatus === "in_progress" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CircularProgress size={24} />
              <span className="em-andamento">Em andamento…</span>
            </Box>
          )}
          {processingStatus === "success" && (
            <span className="concluido-span">Concluído</span>
          )}
          {processingStatus === "error" && (
            <span className="error-span">Falha no envio</span>
          )}
          {processingStatus === "idle" && <span></span>}
        </div>
        <button type="submit" className="botao-enviar" disabled={isProcessing}>
          {isProcessing ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </>
  );
}

export default App;
