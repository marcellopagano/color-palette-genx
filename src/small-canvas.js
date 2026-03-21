async function smallCanvas(canvasOrig) {
  // creazione del Canvas Ridimensionato (non aggiunto al DOM)
  const canvasSmall = document.createElement("canvas");
  const ctxSmall = canvasSmall.getContext("2d");
  // Definisci la nuova dimensione ridotta
  canvasSmall.width = 200;
  canvasSmall.height = 200;
  // Disegna il canvas grande sul piccolo (il browser ridimensiona)
  ctxSmall.drawImage(canvasOrig, 0, 0, canvasSmall.width, canvasSmall.height);
  // Prendi i dati ridimensionati (array molto più piccolo)
  const imageData = ctxSmall.getImageData(
    0,
    0,
    canvasSmall.width,
    canvasSmall.height,
    { colorSpace: "srgb" },
  );
  return imageData; // array ridimensionato
}

export { smallCanvas };
