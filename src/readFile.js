import { smallCanvas } from "./small-canvas.js";

const imageInfo = document.getElementById("image-info");
const canvas = document.getElementById("canvas");

export default async function readFile(ctx, file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = async function () {
          canvas.width = img.width;
          canvas.height = img.height;
          try {
            // disegna immagine su canvas da file
            ctx.drawImage(img, 0, 0);
            // info image
            imageInfo.textContent = "";
            const nameImage = document.createElement("p");
            const resolutionImage = document.createElement("p");
            nameImage.innerHTML = `&#128193; ${file.name}`;
            resolutionImage.innerHTML = `&#128187; ${img.width}x${img.height} px`;
            imageInfo.append(nameImage, resolutionImage);
            // funzione che clona la canvas originale su una canvas temporanera a risoluzione minore
            // per velocizzare le operazioni di generazione/calcolo della palette colori
            const imgData = await smallCanvas(canvas);
            resolve(imgData);
          } catch (error) {
            reject(error);
            imgData = undefined;
          }
        };
      };
      reader.readAsDataURL(file);
    });
  } else {
    alert("Seleziona un file di tipo immagine (.jpg/.png/.webp)");
  }
}
