import { plusCanvas, tilesGen } from "./utils.js";
import { generateColorPalette } from "./colors.js";
import { nRange } from "./range.js";
import { smallCanvas } from "./small-canvas.js";
import touch from "./touch.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageInfo = document.getElementById("image-info");
const progressCalc = document.getElementById("progress-calc");
const rangeColors = document.getElementById("range-colors");
const imageInput = document.getElementById("imageInput");
const btnGenColor = document.getElementById("btn-gen-palette");
const paletteContainer = document.getElementById("palette-container");
const exportCode = document.getElementById("export");

let imgData = undefined;
let paletteColors = 5;

canvas.addEventListener("click", () => {
  imageInput.click();
});

rangeColors.addEventListener("change", (e) => {
  paletteColors = e.target.value;
});

imageInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
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
          imgData = await smallCanvas(canvas);
          btnGenColor.click();
        } catch (error) {
          alert(error);
          imgData = undefined;
        }
      };
    };
    reader.readAsDataURL(file);
  } else {
    alert("Seleziona un file di tipo immagine (.jpg/.png/.webp)");
  }
});

btnGenColor.addEventListener("click", async () => {
  if (imgData === undefined) return;

  try {
    paletteContainer.innerHTML = "";
    progressCalc.style.visibility = "visible";
    exportCode.style.visibility = "visible";
    btnGenColor.disabled = true;
    // estrae colori da canvas
    const colorPalette = await generateColorPalette(imgData, paletteColors);
    // generazione tiles colors + generazione export
    await tilesGen(colorPalette, paletteContainer, paletteColors);
    touch();
  } catch (error) {
    console.log(error);
  } finally {
    btnGenColor.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // disegno plus su canvas
  plusCanvas(ctx);
  // attiva numeri sul range
  nRange();
});
