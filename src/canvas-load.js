import canvasImg from "./assets/upload.png";

// disegna la canvas di partenza
export default async function canvasLoad(ctx) {
  // parametri
  const w = canvas.width / 2;
  const h = canvas.height / 2;
  const x = w; // Centro orizzontale
  const y = h; // Centro verticale

  // carica l'immagine
  async function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }
  // disegna l'immagine sulla canvas
  async function drawImageOnCanvas(ctx, img) {
    const imageWidth = 50;
    const imageHeight = 50;
    // calcola le coordinate del punto centrale dell'immagine
    const x = canvas.width / 2 - imageWidth / 2;
    const y = canvas.height / 2 - imageHeight / 2;
    ctx.drawImage(img, x, y, imageWidth, imageHeight);
  }
  // disegna testo
  function drawText() {
    // impostazioni del testo
    ctx.font = "20px Arial"; // Dimensione e font del testo
    ctx.fillStyle = "gray"; // Colore del testo
    ctx.textAlign = "center"; // Allineamento del testo (centro)
    // Scrivi il testo al centro della croce
    const text = "Upload Picture";
    ctx.fillText(text, x, y + 50);
  }

  try {
    const img = await loadImage(canvasImg);
    drawImageOnCanvas(ctx, img);
    drawText();
  } catch (error) {
    console.log(error.message);
  }
}
